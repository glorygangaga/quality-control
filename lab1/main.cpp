// https://docs.google.com/document/d/1aZPKSTiVUAmGnM3i_GRvoVoVdpLlfQWmXHPSExYmTE0/edit?tab=t.0

#include <iostream>
#include <optional>

struct Triangle
{
  int a;
  int b;
  int c;
};

std::optional<Triangle> ParseArgs(int argc, char *argv[])
{
  if (argc != 4)
  {
    std::cout << "неизвестная ошибка\n";
    return std::nullopt;
  }

  Triangle args;
  try
  {
    args.a = std::stoi(argv[1]);
    args.b = std::stoi(argv[2]);
    args.c = std::stoi(argv[3]);
  }
  catch (const std::exception &e)
  {
    std::cout << "неизвестная ошибка\n";
    return std::nullopt;
  }

  return args;
}

void CheckTriangle(const Triangle &t)
{
  if ((long long)t.a + (long long)t.b <= t.c || (long long)t.a + (long long)t.c <= t.b || (long long)t.b + (long long)t.c <= t.a)
    std::cout << "не треугольник\n";
  else if (t.a == t.b && t.b == t.c)
    std::cout << "равносторонний\n";
  else if (t.a == t.b || t.a == t.c || t.b == t.c)
    std::cout << "равнобедренный\n";
  else
    std::cout << "обычный\n";
}

int main(int argc, char *argv[])
{
  auto args = ParseArgs(argc, argv);

  if (!args)
    return 1;
  else
    CheckTriangle(*args);

  return 0;
}