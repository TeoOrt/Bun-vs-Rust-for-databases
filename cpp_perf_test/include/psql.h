#include <algorithm>
#include <iostream>
#include <pqxx/pqxx>
#include <memory>
#include "library.h"
#include "single_include/nlohmann/json.hpp"
#include <format>
class Psql{
private:

  std::shared_ptr<pqxx::connection> conn;
  bool get_conn(){
  if (!conn->is_open())
  {
    std::cout << "connection was closed" << std::endl; return false; } return true; }



  void create_table(){ if(!get_conn()) return; std::cout << "creating table" << std::endl; // starting transaction 
    pqxx::work tx{*conn}; 
    pqxx::result result = tx.exec("CREATE TABLE IF NOT EXISTS " 
                                  "cpp_books(id SERIAL PRIMARY KEY, " 
                                  "key VARCHAR NOT NULL," 
                                  "title VARCHAR NOT NULL,"
                                  "cover_id INTEGER NOT NULL,"
                                  "subject VARCHAR NOT NULL,"
                                  "authors VARCHAR NOT NULL)"); 
    tx.commit();
  }



public:
  Psql(){

    conn =   std::make_shared<pqxx::connection>("postgres://postgres:postgress@127.0.0.1:5432/postgres");
    std::cout << conn->dbname() << std::endl;
    create_table();

  }
  



  ~Psql(){
    std::cout << "ending connection" <<std::endl;

    if(conn->is_open()){
    conn->close();
    }
  }
  
  void insert_books(Books book){
    

   if(!get_conn()) {return; }
    /*
      conn->prepare("insert_books",
                    " INSERT INTO books_ts "
                    "(key, title, cover_id, subject, authors)" 
                    "VALUES ($1, $2, $3, $4, $5);");
    */

  pqxx::work tx(*conn);
  //we have to serialize our vectors
  const auto authors = book.authors;
  std::string temp = "{'name':'{}','key': '{}'}";

  std::cout << authors[0].authors.dump()<< std::endl;
 // tx.exec_prepared("insert_books","mateo","ortega");
}


};

