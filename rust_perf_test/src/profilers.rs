use std::collections::VecDeque;
use std::time::{self, Instant};

#[derive(Debug)]
pub struct Profilers {
    start: time::Instant,
    times: VecDeque<u128>,
}

impl Profilers {
    pub fn new() -> Self {
        Self {
            start: Instant::now(),
            times: VecDeque::new(),
        }
    }
    pub fn start(&mut self) -> () {
        self.start = Instant::now();
    }

    pub fn stop(&self) -> u128 {
        self.start.elapsed().as_micros()
    }

    pub fn stop_and_record(&mut self) -> () {
        let back = self.times.back();
        match back {
            Some(back_time) => {
                let elapsed = self.start.elapsed().as_micros() - back_time;
                self.times.push_back(elapsed);
            }
            _ => {
                self.times.push_back(self.start.elapsed().as_micros());
            }
        }
    }

    pub fn get_average(&self) -> String {
        let average: u128 =
            self.times.iter().sum::<u128>() / u128::try_from(self.times.len()).unwrap();
        format!("Average back to back time is {}us", average)
    }
}
