#include <iostream>
#include <vector>
#include "single_include/nlohmann/json.hpp"
#ifndef AUTHORS
#define AUTHORS





struct Authors{
  nlohmann::json* authors;
};

#endif // !AUTHORS
//
//
//
//

#ifndef BOOKS 
#define BOOKS
struct Books{
  std::string key;
  std::string title;
  int32_t cover_id;
  std::vector<std::string> subject;
  std::vector<Authors> authors;
};

#endif
