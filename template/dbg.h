/*****************************************************************************

                                dbg(...) macro

License (MIT):

  Copyright (c) 2019 David Peter <mail@david-peter.de>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to
  deal in the Software without restriction, including without limitation the
  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
  sell copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

*****************************************************************************/
#if (defined __GNUG__)
#include <bits/stdc++.h>
using namespace std;
namespace mgt {
namespace pretty_function {

// Compiler-agnostic version of __PRETTY_FUNCTION__ and constants to
// extract the template argument in `type_name_impl`

#if defined(__clang__)
#define DBG_MACRO_PRETTY_FUNCTION __PRETTY_FUNCTION__
static constexpr size_t PREFIX_LENGTH =
    sizeof("const char *mgt::type_name_impl() [T = ") - 1;
static constexpr size_t SUFFIX_LENGTH = sizeof("]") - 1;
#elif defined(__GNUC__) && !defined(__clang__)
#define DBG_MACRO_PRETTY_FUNCTION __PRETTY_FUNCTION__
static constexpr size_t PREFIX_LENGTH =
    sizeof("const char* mgt::type_name_impl() [with T = ") - 1;
static constexpr size_t SUFFIX_LENGTH = sizeof("]") - 1;
#elif defined(_MSC_VER)
#define DBG_MACRO_PRETTY_FUNCTION __FUNCSIG__
static constexpr size_t PREFIX_LENGTH =
    sizeof("const char *__cdecl mgt::type_name_impl<") - 1;
static constexpr size_t SUFFIX_LENGTH = sizeof(">(void)") - 1;
#else
#error "This compiler is currently not supported by dbg_macro."
#endif

} // namespace pretty_function
template <typename T> const char* type_name_impl() {
  return DBG_MACRO_PRETTY_FUNCTION;
}
template <typename T>
std::string get_type_name() {
  namespace pf = pretty_function;

  std::string type = type_name_impl<T>();
  return type.substr(pf::PREFIX_LENGTH,
                     type.size() - pf::PREFIX_LENGTH - pf::SUFFIX_LENGTH);
}

template <typename T> std::string type_name() {
  if (std::is_volatile<T>::value) {
    if (std::is_pointer<T>::value) {
      return type_name<typename std::remove_volatile<T>::type>() + " volatile";
    } else {
      return "volatile " + type_name<typename std::remove_volatile<T>::type>();
    }
  }
  if (std::is_const<T>::value) {
    if (std::is_pointer<T>::value) {
      return type_name<typename std::remove_const<T>::type>() + " const";
    } else {
      return "const " + type_name<typename std::remove_const<T>::type>();
    }
  }
  if (std::is_pointer<T>::value) {
    return type_name<typename std::remove_pointer<T>::type>() + "*";
  }
  if (std::is_lvalue_reference<T>::value) {
    return type_name<typename std::remove_reference<T>::type>() + "&";
  }
  if (std::is_rvalue_reference<T>::value) {
    return type_name<typename std::remove_reference<T>::type>() + "&&";
  }
  return get_type_name<T>();
}
template <>
std::string get_type_name<std::string>() {
  return "std::string";
}
template <typename T> void print_bytes(T val) {
  auto f        = cout.flags();
  auto p        = reinterpret_cast<uint8_t*>(&val);
  int base      = 2;
  uint32_t step = sizeof(T);
  if (base != 2) {
    vector<uint32_t> res;
    for (int i = 0; i < step; ++i)
      res.push_back(p[i]);
    reverse(res.begin(), res.end());
    if (base == 16) {
      for (auto p : res) {
        cout.width(4);
        cout.fill(' ');
        cout << showbase << setbase(base) << left << p << ' ';
      }
    } else {
      for (auto p : res)
        cout << setbase(base) << p << ' ';
    }
  } else {
    vector<bitset<8>> res;
    for (int i = 0; i < step; ++i)
      res.push_back(bitset<8>((uint8_t)p[i]));
    reverse(res.begin(), res.end());
    for (auto p : res)
      cout << p << ' ';
  }
  cout << endl;
  cout.flags(f);
}

template <typename T> void print_hex(T val) {
  auto f        = cout.flags();
  auto p        = reinterpret_cast<uint8_t*>(&val);
  int base      = 16;
  uint32_t step = sizeof(T);
  if (base != 2) {
    vector<uint32_t> res;
    for (int i = 0; i < step; ++i)
      res.push_back(p[i]);
    reverse(res.begin(), res.end());
    if (base == 16) {
      for (auto p : res) {
        cout.width(4);
        cout.fill(' ');
        cout << showbase << setbase(base) << left << p << ' ';
      }
    } 
  }
  cout << endl;
  cout.flags(f);
}

template <typename, typename = void> struct is_stl : std::false_type {};

template <typename T>
struct is_stl<T, std::void_t<decltype(std::declval<T>().begin(),
                                      std::declval<T>().end())>>
    : std::true_type {};

template <typename T, typename U>
using stl = typename std::enable_if<is_stl<T>::value, U>::type;
template <typename T, typename U>
using nonstl = typename std::enable_if<!is_stl<T>::value, U>::type;

std::string to_string(const string& s) { return '"' + s + '"'; }

template <typename T> nonstl<T, std::string> to_string(const T& v) {
  return std::to_string(v);
}

template <typename T> stl<T, std::string> to_string(const T& vec) {
  string res = "[";
  for (auto& i : vec) {
    res += mgt::to_string(i);
    res += ", ";
  }
  if (!res.empty())
    res.pop_back(), res.pop_back();
  res += ']';
  return res;
}

#define value_of(x)                                                            \
  std::cout << (#x + std::string(" = ") + mgt::to_string(x) +                  \
                std::string(" :: ") + mgt::type_name<decltype(x)>())           \
            << std::endl

#define type_of(x)                                                             \
  std::cout << (#x + std::string(" :: ") + mgt::type_name<decltype(x)>())      \
            << std::endl
} // namespace mgt
using mgt::print_bytes;
using mgt::print_hex;
#else
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define type_name(x)                                                           \
  _Generic((x), \
    char: "char", \
    short int: "short int", \
    unsigned short int: "unsigned short int", \
    int: "int", \
    unsigned int: "unsigned int", \
    long int: "long int", \
    unsigned long int: "unsigned long int", \
    long long int: "long long int", \
    unsigned long long int: "unsigned long long int", \
    float: "float", \
    double: "double", \
    long double: "long double", \
    void *: "void*")

#define value_of(x)                                                            \
  {                                                                            \
    const char* type_of_x = type_name(x);                                      \
    if (!strcmp(type_of_x, "int")) {                                           \
      printf(#x " = %d :: %s\n", x, type_of_x);                                \
    } else if (!strcmp(type_of_x, "char")) {                                   \
      printf(#x " = '%c' :: %s\n", x, type_of_x);                              \
    } else if (!strcmp(type_of_x, "short int")) {                              \
      printf(#x " = %hd :: %s\n", x, type_of_x);                               \
    } else if (!strcmp(type_of_x, "unsigned short int")) {                     \
      printf(#x " = %hu :: %s\n", x, type_of_x);                               \
    } else if (!strcmp(type_of_x, "unsigned int")) {                           \
      printf(#x " = %u :: %s\n", x, type_of_x);                                \
    } else if (!strcmp(type_of_x, "long int")) {                               \
      printf(#x " = %ld :: %s\n", x, type_of_x);                               \
    } else if (!strcmp(type_of_x, "unsigned long int")) {                      \
      printf(#x " = %lu :: %s\n", x, type_of_x);                               \
    } else if (!strcmp(type_of_x, "long long int")) {                          \
      printf(#x " = %lld :: %s\n", x, type_of_x);                              \
    } else if (!strcmp(type_of_x, "unsigned long long int")) {                 \
      printf(#x " = %llu :: %s\n", x, type_of_x);                              \
    } else if (!strcmp(type_of_x, "float")) {                                  \
      printf(#x " = %f :: %s\n", x, type_of_x);                                \
    } else if (!strcmp(type_of_x, "double")) {                                 \
      printf(#x " = %f :: %s\n", x, type_of_x);                                \
    } else if (!strcmp(type_of_x, "long double")) {                            \
      printf(#x " = %Lf :: %s\n", x, type_of_x);                               \
    }                                                                          \
  }
#define type_of(x) printf(#x " :: %s\n", type_name(x))

#define print_bytes(x)                                                         \
  {                                                                            \
    int len = sizeof(x);                                                       \
                                                                               \
    typeof(x) y = x;                                                           \
    char* ptr   = (char*)(void*)&y;                                            \
    char buffer[150];                                                          \
    for (int i = 0; i < 150; ++i)                                              \
      buffer[i] = 0;                                                           \
    char* h        = buffer;                                                   \
    unsigned int p = 1;                                                        \
    for (int i = 0; i < len; ++i, ++ptr) {                                     \
      for (int j = 0; j < 8; ++j, p <<= 1, ++h) {                              \
        *h = p & *ptr ? '1' : '0';                                             \
      }                                                                        \
      p    = 1;                                                                \
      *h++ = ' ';                                                              \
    }                                                                          \
    for (len = 0; buffer[len]; ++len)                                          \
      ;                                                                        \
    for (int i = 0, j = len - 1, tmp; i < j; ++i, --j)                         \
      tmp = buffer[i], buffer[i] = buffer[j], buffer[j] = tmp;                 \
    puts(buffer + 1);                                                          \
  }

#endif
