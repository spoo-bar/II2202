# Still TODO

[x] Spoon fixes here code and pushes (Spoon)
[x] Tie statistics into frontend
## Benchmarks
[x] Script needs to run benchmark with mpc (Jasper)
[x] Show exponential increase with participants
[x] Plain text bubble sort with WebSockets as comparison
    This should be in the same manner as the mpc setup. One server is running and multiple clients connect to it (server.js & client.js). Once the session is complete a bubble sort is executed and returned to the client. Communication should be done via WebSockets.
[] STRETCH: Include impact of network latency
    We should use qdiscs; e. g. https://coderwall.com/p/zpckbg/simulate-a-slow-network-with-high-latency-on-your-localhost
    These are not working with WSL2

## Generics:
Display an overview page of sessions (Landing page) (1) (SPOON):

[X] Create session (1)

    [x] Include description

    [x] Include num of participants

    [-] NOT NEEDED Location
        [] Detect location automatically (3); Needs soem thought

[-] NOT NEEDED Overview of pending/unfinsihed sessions (1)

[-] NOT NEEDED Overview of finished sessions (1)

[-] NOT NEEDED Overview of my previous finished sessions (2)
    - Has to be in local browser storage


[x] Clean out useless demo stuff (1) (Spoon)

[x] Remove refences to the other project and import correctly (1) (Spoon)

[x] move our code to src

## Statistics to display: [JASPER PLS]
Some statis stuff is in js file already. Just need to display
- top 10%
- bot 10%
- every 25% split
- mid 50%
- 50th percentile
- mode
- average

### Check the actaul mpc stuff (JASPER)



## Legend Priority:
    1. Must have
    2. Nice
    3. Stretch
