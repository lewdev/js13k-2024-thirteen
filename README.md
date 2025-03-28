# 13attle TanKs
Fear of 13 is the theme.

![JS13K Icon](js13k-images/13attle%20TanKs-320.png)

## Minify code using closure

```bash
npm i -g google-closure-compiler

cd src
npx google-closure-compiler --js=ZzFXMicro.min.js --js=config.js --js=utils.js --js=GameObject.js --js=LevelMap.js --js=gameObjects.js --js=script.js --js=animationLoop.js --js_output_file=script.min.js --compilation_level=SIMPLE_OPTIMIZATIONS --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper
```
Then use [Roadroller](https://lifthrasiir.github.io/roadroller/).

And pasted the compressed JS code into an HTML file and zipped it.

## My original submission

`src_compressed/BattleTanKs.zip` is what I submitted at 11.9Kb

Used `google-closure-compiler` and `roadroller` to get it down to 7.05Kb.

# Post Mortem for 13attle TanKs

## Coming up with an idea

I actually created a series of photos I could use to inspire a game idea but I couldn't decide on anything that motivated me to work on it. And even if I had an idea, I didn't know how to implement it into a game very easily. That's thing about game development is that there's so much to learn before being able to confidently build out an idea.

I might be controvertial to say this but making a JS13k game based on the given theme is for experienced JS13k devs only. Making a game in that size is hard enough and then knowing how to make a game that fits the theme is even harder. My skills were limited and getting creative with the few skills I had was not going to make for an interesting project. So I decided to ignore the theme for now.

## Motivation is key

Because I was stuck trying to fit a game into the theme, I let half the JS13k development time go by until I fired up an old project. It was a barely working tank game with no collision. It was just a little more than the [game example in w3 schools](https://www.w3schools.com/graphics/game_movement.asp). It had a camera and a grid for a map. When I added the pseudo 3D effect to my tank, it created a spark of motivation and I then really wanted this tank game to get going.

This is when I realized how much motivation is so important in writing games. If I don't want to build based on the theme, then I shouldn't because it's not going to make a game. The same thing happened to me last year and this year I told myself to just get an entry submitted.

## My first attempt at AI

I was really excited to finally implement enemy AI. I ran into a lot of problems trying to figure out this problem on my own. For example, figuring out which way a tank should turn towards was a challenge. At first I did this:

```js
const turnDirection = targetAngle > this.angle ? 1 : -1;
```

This messes up the AI because if the `targetAngle` was `1rad` and `this.angle` was `5rad` we should turn right (+1), but it will rotate (-1) left. I had other very inefficient ideas until I drew the problem on a notepad. If I add `Math.PI` (`180deg`) and that new angle value was closer than `this.angle` then we should turn left.

My final solution involves comparing the angle diff with `Math.PI` or `-Math.PI` because depending on its value in that relation, we can determine which way we need to turn.

```js
const angleDiff = normalizeRad(this.angle - targetAngle);
if (angleDiff > 0) this.rotateDirection = Math.abs(angleDiff) > PI ? 1 : -1;
else if (angleDiff < 0) this.rotateDirection = angleDiff < -PI ? -1 : 1;
```

Little known problems like that were probably solved a million times, were fun challenges that I enjoyed throughout the process of making this game and I was able to create artificial life. It was an amazing feeling!

## My first attempt at collisions with immovable objects

I was actually stuck on this for at least 2 days. I kept thinking of new ideas on how to allow an object to drive into the wall and slide against it without driving through it. It kept coming up short so I finally decided to look at LittleJS on how it handled collision against solid objects. There was a "pushBack" value in the direction the object was pushing against plus a tiny bit extra. This kept the tank just a tiny bit away from the object when it stopped moving in its direction. Since I only worked in collision squares that did not rotate, this made things easier.

## My first map generator

I wanted to make a very simple dungeon crawler game but with a single path just to make the game dead simple. The path was to make the player go somewhere, nothing more than that. I wanted to add a mission objective when you reached the end but I ran out of time. This was made from stratch and it was very fun to build. I made sure the path did not run into itself and if it got stuck, it would try again. Usually it wouldn't retry more than two times.

## Optimization

When I tested levels ahead, the game did slow down to a crawl because there were too many objects. I also made a very rudimentary collisions detection solution. It checked collisions with every other object.

I ended up turning off the patrol AI logic so enemy units just stayed still until the player got near. You could basically ambush in that way.

## Canceled before relase: More weapon and enemy types

It was a tough decision because I was so close to the deadline that I couldn't risk not delivering a working game. My game was set up to have configured enemies and weapons. So it could have been added relatively easily but that would mean more testing and making sure nothing broke. I had a working auto plasma gun with sound effects.


## Feedback
* Make the game difficulty easier; it was too hard.
* The gray grid was too plain.
* Needs 