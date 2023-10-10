# RUST VS BUN JS



## PURPOSE
The purpose of this project is to learn about BUN which is a new exiting runtime in Javascript that promises great improvements over NodeJs.




## RUST
For rust we are using the tokio runtime, it was choosen since it is simpler to work with and performant over something like the,
async-std runtime. For our database driver we are using a very common async library called sqlx.


## BUN Javascript
Bun is an exciting new runtime, that promises performance, it might not be fair to use it againts RUST for sqlite operations since from the testings I have done, it seems to be faster.


## TODOS
- Implement a proper test
- Implement optimizations for both testings
- Have a way to display the speed diferences
