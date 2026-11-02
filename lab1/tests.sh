#!/bin/bash

g++ -o triangle ./main.cpp -std=c++17
if [ $? -ne 0 ]; then
  echo "Ошибка компилирования"
  exit 1
fi

while IFS='|' read -r expected args
do
  expected=$(echo "$expected" | xargs)
  args=$(echo "$args" | xargs)
  output=$(./triangle $args)

  if [[ "$output" == "$expected" ]]; then
    echo "Тест пройден"
  else
    echo "Тест не пройден"
  fi
done < tests.txt

echo "Тестирование завершено"