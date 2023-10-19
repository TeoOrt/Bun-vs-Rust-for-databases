# RUST VS BUN JS



## PURPOSE
The purpose of this project is to learn about BUN which is a new exiting runtime in Javascript that promises great improvements over NodeJs.




## RUST
For rust we are using the tokio runtime, it was choosen since it is simpler to work with and performant over something like the,
async-std runtime. For our database driver we are using a very common async library called sqlx.


## BUN Javascript
Bun is an exciting new runtime, that promises performance, it might not be fair to use it againts RUST for sqlite operations since from the testings I have done, it seems to be faster.


## Results for Now

The test consisted of writing books to a database, which is a postgresql database in docker,
it would write 1 by 1 each book several times in parallel, and see how many insertations both systems 
can have in 2 minutes.

#Results
- Bun: 980000(approx)
- Rust: 120000(approx)

## TODOS
- Implement a proper test
- Implement optimizations for both testings
- Have a way to display the speed diferences
