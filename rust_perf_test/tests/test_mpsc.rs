use tokio::sync::mpsc;




#[tokio::test]
async fn test_something(){

    let (tx, mut rx) = mpsc::channel(100);

    tokio::spawn(async move {
        for i in 0..10{
            let res = i+10;
            tx.send(res).await.unwrap();
        }
    });

    let mut vect = Vec::new();

    for i in 0..10{
        vect.push(i+10);
    }
    let mut  ii = 0;
    while let Some(res) = rx.recv().await{
        assert_eq!(vect[ii],res);
        println!("got = {}" , res);
        ii+=1
    }

}
