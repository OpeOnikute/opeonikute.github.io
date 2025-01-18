---
layout: post
title: Ejo
sub_title: Yoruba Snake Game
read_time: 5
date: June 2015
featured_image: https://opeonikute.dev/media/Screen_Shot_2019-05-31_at_18-68f781df-b88a-4804-9262-e39b15ef598a.28.03.png
---

<iframe width="100%" height="315" src="https://www.youtube.com/embed/K5F-aGDIYaM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

This main purpose of this post is to describe how the game was built. Most of it is already covered in the video tutorial though. I just added all the Yoruba nonsense.

The game consists of: 

- A snake eating eba.
- Scoreboard.
- Health bar.
- Exciting animations for a 2D game.
- Pause menu.
- About Menu.

Rules:

- If he eats himself three times, he dies.
- Bushes at the edge are poisonous so they drain all his health.
- You get bonus points after eating a particular amount at intervals.

### Setup

Pygame is a standard Python library for making games. It's very popular and has great support. It's the main module for the game. Pyganim is used here to add animations to the game. 

In this phase we:

- Import dependencies.
- Setup the game screen (Text, Display Width and Height, Icon, Caption, Colors etc).
- Load images.

    import pygame
    import pyganim
    import os
    import random
    
    pygame.init()
    
    images_path = os.getcwd() + "\images\\"
    
    # Setting the display width and height
    display_width = 800
    display_height = 600
    gameDisplay = pygame.display.set_mode((display_width,display_height))
    pygame.display.set_caption('Ejo')

### Animations

The way the animations work is mostly to create frames and go through them at pre-defined speeds. To make an infinite animation, you can create an infinite loop. For example:

    game_overAnim = pyganim.PygAnimation([(images_path + 'game_over2.png', 150), (images_path + 'game_over3.png', 100)])
    bonusAnim = pyganim.PygAnimation([(images_path+'bonus_text1.png', 150), (images_path+'bonus_text2.png', 100)])
    
    while game_over is True:
    		game_overAnim.play()

### Screen Display

The pygame screen is a cartesian plane. What you have to do is write content to the screen at specified coordinates. After writing, you need to call `pygame.display.update`.

`message_to_screen` is a helper function used throughout the game to well, display a message to the screen. First, it gets the rendered font from calling `text_objects` and determines where the centre of the message should be.

    def message_to_screen(msg, color, y_displace=0, x_displace=0, size="small", font=None, font_size=None):
        """
        :param msg:
        :param color:
        :param y_displace:
        :param x_displace:
        :param size:
        :param font:
        :param font_size:
        :return:
        """
        text_surf, text_rect = text_objects(msg, color, size, font, font_size)
        text_rect.center = (display_width/2) + x_displace, (display_height/2) + y_displace
        gameDisplay.blit(text_surf, text_rect)
    
    def text_objects(text, color, size = None,  font = None, fontSize = None):
        """
        :param text:
        :param color:
        :param size:
        :param font:
        :param fontSize:
        :return:
        """
        text_surface = None
    
        if size == 'small':
            text_surface = small_font.render(text, True, color)
        elif size == 'medium':
            text_surface = med_fontButton.render(text, True, color)
        elif size == 'large':
            text_surface = large_font.render(text, True, color)
        elif font is not None:
            font = pygame.font.Font(r'C:\Users\Ope O\Downloads\Fonts' + '\\' + font , fontSize)
            text_surface = font.render(text, True, color)
    
        return text_surface, text_surface.get_rect()

`gameDisplay.blit(image, x, y)` is used to display images to the screen. You'd come across it often in the code.

### Snake

The snake is a list, which is appended to increase the length etc. The main characteristics of the snake are:

1. **Length** - As long as the items in the list, plus the length. Each item that's not the head has a block size of 20.
2. **Health** - Starts off at 90. Reduced by 30 if snake eats itself and totally if you enter the barrier.
3. **Skin** - Each entry in the list (that is not the head) is displayed using an image loaded from source.
4. **Head** - First list element. An image is used to depict this too.
5. **Direction** - The snake moves in a direction by continuously adding to the coordinates in the main game loop. The default block size is 20. 

        for event in pygame.event.get():
        		if event.type == pygame.QUIT:
        		    game_exit = True
        		if event.type == pygame.KEYDOWN:
        		    if event.key == pygame.K_LEFT:
        		        direction = 'left'
        		        lead_x_change = -block_size
        		        lead_y_change = 0
        		    elif event.key == pygame.K_RIGHT:
        		        direction = 'right'
        		        lead_x_change = block_size
        		        lead_y_change = 0 
        		    elif event.key == pygame.K_UP:
        		        direction = 'up'
        		        lead_y_change = -block_size
        		        lead_x_change = 0 
        		    elif event.key == pygame.K_DOWN:
        		        direction = 'down'
        		        lead_y_change = block_size
        		        lead_x_change = 0
        		    elif event.key == pygame.K_p:
        		        pause()
        
        lead_x += lead_x_change
        lead_y += lead_y_change
        
        snake_head = list()
        snake_head.append(lead_x)
        snake_head.append(lead_y)
        snake_list.append(snake_head)

    When the direction is changed, the snake head needs to be rotated to face the direction it's moving.

        def Snake(block_size, snake_list):
            """
            functionality for rotation
            :param block_size:
            :param snake_list:
            :return:
            """
        
            head = None
            
            if direction == 'right':
                head = pygame.transform.rotate(img, 270)
            if direction == 'left':
                head = pygame.transform.rotate(img, 90)
            if direction == 'up':
                head = img
            if direction == 'down':
                head = pygame.transform.rotate(img, 180)
        
            gameDisplay.blit(head, (snake_list[-1][0], snake_list[-1][1]))
        
            for XnY in snake_list[:-1]:
                gameDisplay.blit(skin,  (XnY[0], XnY[1]))

6. **Position** - Each part of the snake's body has it's own (x & y) coordinates.

### Game Loop

Most of the functionality of the game is implemented by running while loops, including what is called the main game loop. The loop is only exited on some user input e.g. exit. 

Going back to calling `pygame.display.update`, the display needs to be updated after each iteration of the loop to ensure graphics are rendered properly.

In the while loops, various conditions are checked to determine if an action needs to be taken. Some examples of this are:

- The snake head intersecting with a body part.
- User pressing pause.
- Snake head meeting the barrier.
- Snake head intersecting with eba.

        # And this is the code for when the snake 'eats' an apple
        if (rand_apple_x < lead_x < rand_apple_x + AppleThickness) or (
              rand_apple_x < lead_x + block_size < rand_apple_x + AppleThickness):
          if rand_apple_y < lead_y < rand_apple_y + AppleThickness:
              rand_apple_x, rand_apple_y = randAppleGen()
              score_value += 4
              snake_length += 4
          elif rand_apple_y < lead_y + block_size < rand_apple_y + AppleThickness:
              rand_apple_x, rand_apple_y = randAppleGen()
              snake_length += 4
              score_value += 4

### Eba

The eba is displayed using an image loaded from source. It's main functionality is to be generated in pseudo-random positions for the user to chase, and re-generate when it's 'eaten'.

The apple thickness is a global variable set by default to 30. 

    def randAppleGen():
        """
        :return:
        """
        rand_apple_x = round(random.randrange(40, display_width - AppleThickness - 40))
        rand_apple_y = round(random.randrange(30, display_height - AppleThickness - 30))
    
        return rand_apple_x, rand_apple_y

### Score

The score is text displayed at the upper right corner. 

    def score_update(score):
        """
        :param score:
        :return:
        """
        text = small_font.render('Score: ' + str(score), True, white)
        gameDisplay.blit(text, [display_width - 765,20])

### Health Bar

    def health_bars(snake_health):
        """
        :param snake_health:
        :return:
        """
        if snake_health > 75:
            snake_health_color = green
        elif snake_health > 50:
            snake_health_color = yellow
        else:
            snake_health_color = red
        health_text = small_font.render('Health: ', True, white)
        gameDisplay.blit(health_text,[display_width-210, 20])
        pygame.draw.rect(gameDisplay, black , (display_width-131, 25, 92, 22))
        pygame.draw.rect(gameDisplay, white , (display_width-130, 26, 90, 20))
        pygame.draw.rect(gameDisplay, snake_health_color , (display_width-130, 26, snake_health, 20))

### Screenshots

![](/media/Screen_Shot_2019-05-31_at_18-68f781df-b88a-4804-9262-e39b15ef598a.28.03.png)

![](/media/Screen_Shot_2019-05-31_at_18-32ec9275-d6d9-4a6c-89ef-824339f11203.28.22.png)

![](/media/Screen_Shot_2019-05-31_at_18-09e1055d-8ae0-492f-a813-bf87fab95dea.28.32.png)

### Running in Docker

I tried to put the app in a container for the purpose of this post, but couldn't. I'll publish another post soon about that whole process and why it might not be a dead-end.

Tbh though, all you really need is to have Python on your machine and probably ability to create a virtualenv.

### Ideas/Improvements

1. Soundtrack.
2. Storyline.
3. Different levels e.g. random obstacles get introduced at higher levels.
4. High Score.

If you want to see the entire picture, the repo is open-source [here](https://github.com/OpeOnikute/Ejo---The-Yoruba-Snake-Game). Feel free to clone and contribute.