// Faire une requête GET à votre serveur
import "./style.css";

fetch("http://localhost:3000/habits")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const appElement = document.getElementById("app");

    // Créer un élément ul
    const ulElement = document.createElement("ul");

    data.habits.map((habit) => {
      // Créer un élément de liste pour chaque habitude
      const liHabit = document.createElement("li");
      liHabit.innerHTML = `${habit.title}`;

      // Créer un élément icon pour chaque habitude (correction ici)
      const iconHabit = document.createElement("i");
      iconHabit.classList.add("fas", habit.completed ? "fa-check" : "fa-times");
      iconHabit.classList.add(habit.completed ? "check-green" : "check-red");

      // Ajouter un écouteur d'événement au click sur l'icône (correction ici)
      iconHabit.addEventListener("click", () => {
        if (iconHabit.classList.contains("fa-check")) {
          iconHabit.classList.replace("fa-check", "fa-times");
          iconHabit.classList.replace("check-green", "check-red");
          liHabit.classList.remove("green-background"); // Supprime la classe "green-background"
          liHabit.classList.add("red-background"); // Ajoute la classe "red-background"
        } else {
          iconHabit.classList.replace("fa-times", "fa-check");
          iconHabit.classList.replace("check-red", "check-green");
          liHabit.classList.remove("red-background"); // Supprime la classe "red-background"
          liHabit.classList.add("green-background"); // Ajoute la classe "green-background"
        }
      });

      // Ajouter l'icône à l'élément de liste
      liHabit.appendChild(iconHabit);

      // Append the liHabit to the ulElement
      ulElement.appendChild(liHabit);
    });

    // Append the ulElement to the "app" element
    appElement.appendChild(ulElement);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
