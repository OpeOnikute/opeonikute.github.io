---
layout: post
title: How to make a simple logo watermark tool in 100 lines of Golang
sub_title: 
date: October 2019
featured_image: https://opeonikute.dev/img/Background.png
synopsis: A common need for creatives is to place our logo on pictures we produce. e.g. A photographer with 100s of dope pictures about to post them on social media. 
---

A common need for creatives is to place our logo on pictures we produce. e.g. A photographer with 100s of dope pictures about to post them on social media. 

In this tutorial, we’ll be looking at how to make a simple watermark tool in Golang. The program will place a smaller image (the logo) on the larger one, at the bottom right. 

### Prerequisites

- Basic understanding of programming.
- Golang (You should be fine with 1.11 and above).

### Overview

Our watermark tool will do the following:

- Take in a background image and a watermark.
- Resize the watermark while preserving it’s aspect ratio.
- Place the water mark on the bottom right of the background, with specified padding.
- Save the new image with a different name.

### Image Processing

For basic image manipulation, this [imaging package](https://github.com/disintegration/imaging) by disintegration is sufficient. It has features to 

- Resize
- Filter
- Perform image placement and more.

To add the package, run `go get -u [github.com/disintegration/imaging](http://github.com/disintegration/imaging)`

### Code

Let's start with the main function. Since it's a command line application, we'll receive the file names as arguments. 

    package main
    
    import (
    	"fmt"
    	"os"
    )
    
    const invalidCommand = "Please enter a valid input."
    
    func main() {
    
    	// The first argument is the path to the program, so we'll omit it.
    	args := os.Args[1:]
    
    	if len(args) < 2 {
    		fmt.Println(invalidCommand)
    		return
    	}
    
    	background := args[0]
    	watermark := args[1]
    }

Next, we need a function to place an image over the other. 

Considering the [Single Responsibility Principle](https://medium.com/@severinperez/writing-flexible-code-with-the-single-responsibility-principle-b71c4f3f883f), I chose to separate the image placement logic from the watermark logic to make the program more flexible. 

In total, we'll write three functions in this section. P.S. For brevity, i'm including only the dependencies needed for each function. 

**parseCoordinates** - Get coordinates from text such as `200x200`.

    import (
    	"log"
    	"strconv"
    	"strings"
    )
    
    func parseCoordinates(input, delimiter string) (int, int) {
    
    	arr := strings.Split(input, delimiter)
    
    	// convert a string to an int
    	x, err := strconv.Atoi(arr[0])
    
    	if err != nil {
    		log.Fatalf("failed to parse x coordinate: %v", err)
    	}
    
    	y, err := strconv.Atoi(arr[1])
    
    	if err != nil {
    		log.Fatalf("failed to parse y coordinate: %v", err)
    	}
    
    	return x, y
    }

**openImage** - Read image from the specified path.

    import (
    	"log"
    	"github.com/disintegration/imaging"
    )
    
    func openImage(name string) image.Image {
    	src, err := imaging.Open(name)
    	if err != nil {
    		log.Fatalf("failed to open image: %v", err)
    	}
    	return src
    }

**resizeImage - R**esize an image to fit these dimensions, preserving aspect ratio.

    import (
    	"fmt"
    	"os"
    	"github.com/disintegration/imaging"
    )
    
    func resizeImage (image, dimensions string) image.Image {
    
    	width, height := parseCoordinates(dimensions, "x")
    
    	src := openImage(image)
    
    	return imaging.Fit(src, width, height, imaging.Lanczos)
    }

**placeImage** - Put one image on another. This uses both `parseCoordinates` and `openImage`.

    import (
    	"fmt"
    	"os"
    	"github.com/disintegration/imaging"
    )
    
    func placeImage(outName, bgImg, markImg, markDimensions, locationDimensions string) {
    
    	// Coordinate to super-impose on. e.g. 200x500
    	locationX, locationY := parseCoordinates(locationDimensions, "x")
    
    	src := openImage(bgImg)
    
    	// Resize the watermark to fit these dimensions, preserving aspect ratio. 
    	markFit := resizeImage(markImg, markDimensions)
    
    	// Place the watermark over the background in the location
    	dst := imaging.Paste(src, markFit, image.Pt(locationX, locationY))
    
    	err := imaging.Save(dst, outName)
    
    	if err != nil {
    		log.Fatalf("failed to save image: %v", err)
    	}
    
    	fmt.Printf("Placed image '%s' on '%s'.\n", markImg, bgImg)
    }

This should be pretty easy to understand as we've separated all the different logic into functions. 

---

We can now implement our watermark function, bringing all this together. In this getting this right, there are two things involved:

1. Calculating the watermark position.
2. Placing the watermark in that position.

**Calculating The WaterMark Position**

Since we know the watermark is to be placed on the bottom right, we need to:

- Subtract the watermark size (200x200) from both the x and y coordinates of the background image and use that as the location. After doing that, the watermark will be placed like such:

    ![](/media/Screen_Shot_2019-10-23_at_14-5bcd36e6-f4ce-46cf-a182-d1cd793e6041.15.13.png)

- Add a padding (20px)

    The watermark has to be spaced a little bit equidistant from the edges of the background to look good. So we need to add a padding. 

    This can be done easily by subtracting the padding (e.g. 20px) from both the x and y coordinates from the watermark position. 

    But that presents a small problem: images with an imperfect aspect ratio won't resize to 200x200 since the aspect ratio is preserved. Instead, they'd be skewed (e.g. 200x40 or 40x200), making the padding look uneven. 

    To solve this problem, we specify a constant padding of 20 and multiply that by the aspect ratio of the background. This means that the larger side of the image will have less padding.

    ![](/media/Screen_Shot_2019-10-23_at_14-77472346-4a17-46a7-b088-17a87891d20b.15.44.png)

    And it's implementation:

    // Subtracts the dimensions of the watermark and padding based on the background's aspect ratio
    func calcWaterMarkPosition(bgDimensions, markDimensions image.Point, aspectRatio float64) (int, int) {
    
    	bgX := bgDimensions.X
    	bgY := bgDimensions.Y
    	markX := markDimensions.X
    	markY := markDimensions.Y
    
    	padding := 20 * int(aspectRatio)
    
    	return bgX - markX - padding, bgY - markY - padding
    }

**Adding the water mark**

Finally, we can implement the function to add the watermark. This function does the following:

- Generates a name for the output image.
- Gets the dimensions of both the background and watermark, using the resize function.
```
    func addWaterMark(bgImg, watermark string) {
    
    	outName := fmt.Sprintf("watermark-new-%s", watermark)
    
    	src := openImage(bgImg)
    
    	markFit := resizeImage(watermark, "200x200")
    
    	bgDimensions := src.Bounds().Max
    	markDimensions := markFit.Bounds().Max
    
    	bgAspectRatio := math.Round(float64(bgDimensions.X) / float64(bgDimensions.Y))
    
    	xPos, yPos := calcWaterMarkPosition(bgDimensions, markDimensions, bgAspectRatio)
    
    	placeImage(outName, bgImg, watermark, watermarkSize, fmt.Sprintf("%dx%d", xPos, yPos))
    
    	fmt.Printf("Added watermark '%s' to image '%s' with dimensions %s.\n", watermark, bgImg, watermarkSize)
    }
```

### **Bringing it all together**

We can now complete our main function by bringing all the functions together and running a command. e.g. `go run main.go sample1.png sample2.png`.

    package main
    
    import (
    	"fmt"
    	"image"
    	"log"
    	"math"
    	"os"
    	"strconv"
    	"strings"
    
    	"github.com/disintegration/imaging"
    )
    
    const invalidCommand = "Please enter a valid input."
    
    func main() {
    
    	// The first argument is the path to the program, so we'll omit it.
    	args := os.Args[1:]
    
    	if len(args) < 2 {
    		fmt.Println(invalidCommand)
    		return
    	}
    
    	background := args[0]
    	watermark := args[1]
    
    	addWaterMark(background, watermark)
    }
    
    func addWaterMark(bgImg, watermark string) {
    
    	outName := fmt.Sprintf("watermark-new-%s", watermark)
    
    	src := openImage(bgImg)
    
    	markFit := resizeImage(watermark, "200x200")
    
    	bgDimensions := src.Bounds().Max
    	markDimensions := markFit.Bounds().Max
    
    	bgAspectRatio := math.Round(float64(bgDimensions.X) / float64(bgDimensions.Y))
    
    	xPos, yPos := calcWaterMarkPosition(bgDimensions, markDimensions, bgAspectRatio)
    
    	placeImage(outName, bgImg, watermark, watermarkSize, fmt.Sprintf("%dx%d", xPos, yPos))
    
    	fmt.Printf("Added watermark '%s' to image '%s' with dimensions %s.\n", watermark, bgImg, watermarkSize)
    }
    
    func placeImage(outName, bgImg, markImg, markDimensions, locationDimensions string) {
    
    	// Coordinate to super-impose on. e.g. 200x500
    	locationX, locationY := parseCoordinates(locationDimensions, "x")
    
    	src := openImage(bgImg)
    
    	// Resize the watermark to fit these dimensions, preserving aspect ratio. 
    	markFit := resizeImage(markImg, markDimensions)
    
    	// Place the watermark over the background in the location
    	dst := imaging.Paste(src, markFit, image.Pt(locationX, locationY))
    
    	err := imaging.Save(dst, outName)
    
    	if err != nil {
    		log.Fatalf("failed to save image: %v", err)
    	}
    
    	fmt.Printf("Placed image '%s' on '%s'.\n", markImg, bgImg)
    }
    
    func resizeImage (image, dimensions string) image.Image {
    
    	width, height := parseCoordinates(dimensions, "x")
    
    	src := openImage(image)
    
    	return imaging.Fit(src, width, height, imaging.Lanczos)
    }
    
    func openImage(name string) image.Image {
    	src, err := imaging.Open(name)
    	if err != nil {
    		log.Fatalf("failed to open image: %v", err)
    	}
    	return src
    }
    
    func parseCoordinates(input, delimiter string) (int, int) {
    
    	arr := strings.Split(input, delimiter)
    
    	// convert a string to an int
    	x, err := strconv.Atoi(arr[0])
    
    	if err != nil {
    		log.Fatalf("failed to parse x coordinate: %v", err)
    	}
    
    	y, err := strconv.Atoi(arr[1])
    
    	if err != nil {
    		log.Fatalf("failed to parse y coordinate: %v", err)
    	}
    
    	return x, y
    }

---

That's it. We've written a basic watermark tool in ~100 lines of Golang. Hopefully this was pretty straightforward and easy to replicate. 

### Ideas for Improvement

We can extend this and make it better in a couple of ways.

1. Add support for multiple background images. 
2. Refactor parseCoordinates - There has to be a shorter way to do this lol. Maybe `map` and convert all elements to int.
3. Add support for different positions. 

P.S I never intend for these posts to get this long. But they eventually do 🙃