/** @format */
import { sortStudents } from "../utils.js";
describe("sortStudents", () => {
  test("should sort students by grade ascending", () => {
    const students = [
      { name: "Ali", grade: 15, age: 20 },
      { name: "Fatou", grade: 10, age: 22 },
      { name: "Moussa", grade: 12, age: 19 },
    ];

    const result = sortStudents(students, "grade", "asc");

    expect(result).toEqual([
      { name: "Fatou", grade: 10, age: 22 },
      { name: "Moussa", grade: 12, age: 19 },
      { name: "Ali", grade: 15, age: 20 },
    ]);
  });

  test("should sort students by grade descending", () => {
    const students = [
      { name: "Ali", grade: 15, age: 20 },
      { name: "Fatou", grade: 10, age: 22 },
      { name: "Moussa", grade: 12, age: 19 },
    ];

    const result = sortStudents(students, "grade", "desc");

    expect(result).toEqual([
      { name: "Ali", grade: 15, age: 20 },
      { name: "Moussa", grade: 12, age: 19 },
      { name: "Fatou", grade: 10, age: 22 },
    ]);
  });

  test("should sort students by name ascending", () => {
    const students = [
      { name: "Moussa", grade: 12, age: 19 },
      { name: "Ali", grade: 15, age: 20 },
      { name: "Fatou", grade: 10, age: 22 },
    ];

    const result = sortStudents(students, "name", "asc");

    expect(result).toEqual([
      { name: "Ali", grade: 15, age: 20 },
      { name: "Fatou", grade: 10, age: 22 },
      { name: "Moussa", grade: 12, age: 19 },
    ]);
  });

  test("should sort students by age ascending", () => {
    const students = [
      { name: "Ali", grade: 15, age: 20 },
      { name: "Fatou", grade: 10, age: 22 },
      { name: "Moussa", grade: 12, age: 19 },
    ];

    const result = sortStudents(students, "age", "asc");

    expect(result).toEqual([
      { name: "Moussa", grade: 12, age: 19 },
      { name: "Ali", grade: 15, age: 20 },
      { name: "Fatou", grade: 10, age: 22 },
    ]);
  });

  test("should return empty array for null input", () => {
    const result = sortStudents(null as any, "grade", "asc");

    expect(result).toEqual([]);
  });
  test("should return empty array for empty input", () => {
    const result = sortStudents([], "grade", "asc");

    expect(result).toEqual([]);
  });

  test("should not modify the original array", () => {
    const students = [
      { name: "Ali", grade: 15, age: 20 },
      { name: "Fatou", grade: 10, age: 22 },
      { name: "Moussa", grade: 12, age: 19 },
    ];

    const original = [...students];

    sortStudents(students, "grade", "asc");

    expect(students).toEqual(original);
  });

  test("should default to ascending order", () => {
    const students = [
      { name: "Ali", grade: 15, age: 20 },
      { name: "Fatou", grade: 10, age: 22 },
      { name: "Moussa", grade: 12, age: 19 },
    ];

    // pas de "order" ici
    const result = sortStudents(students, "grade");

    expect(result).toEqual([
      { name: "Fatou", grade: 10, age: 22 },
      { name: "Moussa", grade: 12, age: 19 },
      { name: "Ali", grade: 15, age: 20 },
    ]);
  });
});
