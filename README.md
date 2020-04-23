# test-inker

A simple script for automatic testing of Inky stories.

This script automatically clicks links in an HTML page exported with Inky and shows the resulting text output.

0. Use with newest Inky version only ("restart" link in web export is required)

1. First export your story as web project from Inky.

2. Inside "index.html", include the "ink-tester" script:

    <script src="ink-tester.js"></script>
    
    <script src="ink.js"></script>
    
    <script src="story.js"></script>
    
    <script src="main.js"></script>

3. Inside your "main.js" change delay from 200.0 to 0.0 (several lines)

  This way the elements will show immediately instead of fading in for some time.

4. Open "index.html" in the browser, open the browser console and type: "_testInky.test()". This should initialize the first playthrough and show you a window with results.

5. Click on next playthrough or run "_testInky.test()" again to get the next playthrough.

6.
The testing program will play the story by always selecting the first option it hasn't tried yet. To illustrate the basic pattern:

Program chooses:
option 0 / option 0 / option 0 / option 0 / GAME ENDS

option 0 / option 0 / option 0 / option 1 / option 0 / option 0 GAME ENDS

option 0 / option 0 / option 0 / option 1 / option 0 / option 1 GAME ENDS

option 0 / option 0 / option 0 / option 1 / option 0 / option 2 GAME ENDS

option 0 / option 0 / option 0 / option 1 / option 1 / GAME ENDS

option 0 / option 0 / option 0 / option 2 / GAME ENDS

etc.

7. Seeding:

You can use _testInky.seedQueue to change the sequence where the program starts from. _testInky.seedQueue receives a string of slash-separated integers.

_testInky.seedQueue(" 2 / 3 / 0 ")
  -> start story, then choose third option (index 2), then fourth option (index 3), then first option (index 0). After that the program proceeds to pick choices in the normal fashion described above.

If a choice index is not valid, the window will currently just remain blank. (test with: _testInky.seedQueue("999") )

8. The script tries to recognize looping stories and breaks if the loop is too long, in order to avoid infinite recursion. (Not sure yet how well this works).




