There were a large number of edge cases I was finding before simplifying the round robin logic.
This contains an alternative strategy. Specifically, it was trying to do a sort on the teams total games and then optimize the number of games played within a round and overall.
After revisiting the original scheduling function, it seemed like the way it generated games solved all test cases that could be concieved of for the MVP, so it is used.
