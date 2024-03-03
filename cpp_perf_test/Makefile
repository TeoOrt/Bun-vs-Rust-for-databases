# Compiler
CXX = clang++
# Compiler flags
CXXFLAGS = -std=c++17 -Wall $(shell pkg-config --cflags libpqxx)

# Linker flags
LDFLAGS = $(shell pkg-config --libs libpqxx) -lpq 

# Source files
SOURCES = main.cpp
OBJECTS = $(SOURCES:.cpp=.o)
EXECUTABLE = main

all: $(EXECUTABLE)

$(EXECUTABLE): $(OBJECTS)
	$(CXX)  $(OBJECTS) -o $@ $(LDFLAGS)

.cpp.o:
	$(CXX) $(CXXFLAGS) -c $< -o $@

install-deps:
	sudo dnf install -y postgresql-devel
	sudo dnf install -y libpqxx
	# Add commands to install libpqxx and other dependencies if they are not available via yum

clean:
	rm -f $(OBJECTS) $(EXECUTABLE)

.PHONY: all install-deps clean

