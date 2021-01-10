## Running Demo

1. Running a server:
    ```shell
    node server.js
    ```
    Alternative:
    ```shell
    docker run --rm -p 8081:8080 $(docker build -q .)
    ```

2. Open browser based parties by going to *http://localhost:8080/index.html* in the browser


## Benchmark

Run the benchmark with:
`./benchmark.sh`

Sample output:
```
number of clients;time in seconds
1;1.811
2;1.420
3;2.352
4;4.031
5;7.015
6;13.843
7;22.286
8;46.320
9;69.691
10;108.101
11;201.155
12;250.068
```