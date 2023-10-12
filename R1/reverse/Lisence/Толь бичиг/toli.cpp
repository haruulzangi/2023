#include <iostream>
#include <string>
#include <unordered_map>

int main() {
    std::unordered_map<char, int> toli = {
        {'A', 33},
        {'B', 45},
        {'C', 21},
        {'D', 13},
        {'E', 18},
        {'F', 67},
        {'G', 87},
        {'H', 53},
        {'I', 22},
        {'J', 91},
        {'K', 98},
        {'L', 48},
        {'M', 72},
        {'N', 19},
        {'O', 42},
        {'P', 88},
        {'Q', 24},
        {'R', 37},
        {'S', 80},
        {'T', 97},
        {'U', 63},
        {'V', 71},
        {'W', 28},
        {'X', 54},
        {'Y', 16},
        {'Z', 50},
        {'{', 66},
        {'2', 73},
        {'_', 83},
        {'1', 56},
        {'}', 70},
        {'0', 10},
        {'6', 62},
        {'7', 23},
        {'8', 44},
        {'9', 60},
        {'5', 28},
        {'4', 30},
        {'3', 92}
    };

    std::string utga;
    std::cout << "Толь минь толь минь энэ ертөнцийн хамгийн ...." << std::endl;
    std::cout << "Даалгавар: Тугийг олно уу!" << std::endl;
    std::cout << "Тольдсоны дараа:0731733335815479913312380878912235793881848827220866293701370535" <<std::endl;
    std::cout << "Тугийг оруул!" <<std::endl;
    std::cin >> utga;

    for (char& c : utga) {
        c = std::toupper(c);
    }

    std::string niit = "";
    for (char c : utga) {
        niit += std::to_string(toli[c]);
    }

    std::string tug = "0731733335815479913312380878912235793881848827220866293701370535";

    if (niit == std::string(tug.rbegin(), tug.rend())) {
        std::cout << "Зөв байна."<< std::endl;
    } else {
        std::cout << "Буруу!"<< std::endl;
    }

    return 0;
}
