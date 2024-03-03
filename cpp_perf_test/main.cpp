#include <algorithm>
#include <cstdint>
#include <iostream>
#include <iterator>
#include <ostream>
#include <pqxx/pqxx>
#include <sstream>
#include <string>
#include "include/single_include/nlohmann/json.hpp"
#include <fstream>
#include <memory>
#include <vector>
#include "include/library.h"
#include "include/psql.h"


using namespace std;
using namespace nlohmann;

/*
* @purpose: Parse store in json Object
*/
json read_file(const std::string &filename)
{

  ifstream stream(filename);

  return json::parse(stream);
}



int main()
{
  // Read testing file
  const string filename = "test.json";
  const json json_file = read_file(filename);
  Psql p;


  //lets create a library(literally) for the books_ts
  vector<Books> Library ;

  const auto capture = [&](const auto& n) {
    vector<std::string> subject;
    vector<Authors> authors;
  
    std::transform(n["subject"].begin(), n["subject"].end(),std::back_inserter(subject),[](const std::string& elem){
        return elem;
      }) ;
    std::transform(n["authors"].begin(),n["authors"].end(),std::back_inserter(authors),[](auto name){
      Authors author;
      author.authors = name;
      return author;
    });

    //storing book
    Books book;
    book.subject = subject;
    book.authors = authors;
    book.key = n["key"];
    book.title = n["title"];
    book.cover_id = n["cover_id"];
    //putting book in the shelves
    Library.push_back(book);
  };
  for_each(json_file.begin(),json_file.end(),capture);

  Psql *db = new Psql();
  db->insert_books(Library[3]);
  delete db;  
  

  

};



  // start the parser
