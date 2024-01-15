import "./style.css";

function createHabitElement(habit, ulElement) {
  const liHabit = document.createElement("li");
  liHabit.innerHTML = `${habit.title}`;

  const iconHabit = document.createElement("i");
  const completed = habit.completed !== undefined ? habit.completed : false;
  iconHabit.classList.add("fas", completed ? "fa-check" : "fa-times");
  iconHabit.classList.add(completed ? "check-green" : "check-red");

  iconHabit.addEventListener("click", () => {
    if (iconHabit.classList.contains("fa-check")) {
      iconHabit.classList.replace("fa-check", "fa-times");
      iconHabit.classList.replace("check-green", "check-red");
      liHabit.classList.remove("green-background");
      liHabit.classList.add("red-background");
    } else {
      iconHabit.classList.replace("fa-times", "fa-check");
      iconHabit.classList.replace("check-red", "check-green");
      liHabit.classList.remove("red-background");
      liHabit.classList.add("green-background");
    }
  });

  liHabit.appendChild(iconHabit);
  ulElement.appendChild(liHabit);
}

document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  const ulElement = document.createElement("ul");
  appElement.appendChild(ulElement);

  fetch("http://localhost:3000/habits/today")
    .then((response) => response.json())
    .then((data) => {
      data.habits.map((habit) => createHabitElement(habit, ulElement));
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  document.getElementById("addHabitButton").addEventListener("click", () => {
    document.getElementById("addHabitModal").style.display = "block";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("addHabitModal").style.display = "none";
  });

  document
    .getElementById("newHabitForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const newHabitTitle = document.getElementById("newHabitTitle").value;

      if (newHabitTitle) {
        fetch("http://localhost:3000/habits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newHabitTitle,
            completed: false,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            createHabitElement(data.habit, ulElement); // Utiliser l'objet de l'habitude complète
            document.getElementById("addHabitModal").style.display = "none";
          })
          .catch((error) => {
            console.error(
              "Erreur lors de l'ajout d'une nouvelle habitude:",
              error
            );
          });
      }
    });
});
