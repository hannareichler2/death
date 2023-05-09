document.addEventListener("DOMContentLoaded", () => {
  const beforeExhibition = document.querySelector(".before-exhibition");
  const afterExhibition = document.querySelector(".after-exhibition");

  let surveyData = [];

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  function getCookie(name) {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim();
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return "";
  }

  const storedData = getCookie("surveyData");
  if (storedData) {
    surveyData = JSON.parse(storedData);
    createHalfCircles(surveyData);
  }

  function createHalfCircles(data) {
    beforeExhibition.innerHTML = "";
    afterExhibition.innerHTML = "";

    const num = data.length;
    const size = num * 2;
    const steps = size / num;

    data.forEach((entry, index) => {
      const beforeCircleContainer = document.createElement("div");
      const afterCircleContainer = document.createElement("div");

      const beforeCircle = document.createElement("div");
      const afterCircle = document.createElement("div");

      beforeCircleContainer.classList.add("half-circle");
      afterCircleContainer.classList.add("half-circle");

      beforeCircle.classList.add("circle");
      afterCircle.classList.add("circle");

      beforeCircle.style.backgroundColor = entry.before ? "black" : "white";
      afterCircle.style.backgroundColor = entry.after ? "black" : "white";

      const circleSize = size - index * steps;

      beforeCircleContainer.style.width = `${circleSize / 2}px`;
      beforeCircleContainer.style.height = `${circleSize}px`;
      beforeCircle.style.width = `${circleSize}px`;
      beforeCircle.style.height = `${circleSize}px`;

      afterCircleContainer.style.width = `${circleSize / 2}px`;
      afterCircleContainer.style.height = `${circleSize}px`;
      afterCircle.style.width = `${circleSize}px`;
      afterCircle.style.height = `${circleSize}px`;

      beforeCircleContainer.style.left = `0`;
      beforeCircleContainer.style.transform = `translate(0, -50%)`;

      afterCircleContainer.style.right = `0`;
      afterCircleContainer.style.transform = `translate(0, -50%) rotate(180deg)`;

      beforeCircleContainer.appendChild(beforeCircle);
      afterCircleContainer.appendChild(afterCircle);

      beforeExhibition.appendChild(beforeCircleContainer);
      afterExhibition.appendChild(afterCircleContainer);
    });
  }

  const preForm = document.createElement("form");
  const postForm = document.createElement("form");

   preForm.innerHTML = `
     <h3>QUICK QUESTION</h3>
     <label for="before">DO YOU BELIVE IN THE AFTERLIFE?</label>
     <div>
       <button type="button" class="yes-button" data-value="yes">Yes</button>
       <button type="button" class="no-button" data-value="no">No</button>
     </div>
   `;

   postForm.innerHTML = `
     <h3>WELCOME BACK</h3>
     <label for="after">NOW, DO YOU BELIVE IN THE AFTERLIFE?</label>
     <div>
       <button type="button" class="yes-button" data-value="yes">Yes</button>
       <button type="button" class="no-button" data-value=" no ">No</button>
     </div>
   `;

   preForm.addEventListener("click", (event) => {
     if (event.target.classList.contains("yes-button") || event.target.classList.contains("no-button")) {
       const before = event.target.getAttribute("data-value") === "yes";
       preForm.dispatchEvent(new CustomEvent("submit", { detail: { before } }));
     }
   });

   postForm.addEventListener("click", (event) => {
     if (event.target.classList.contains("yes-button") || event.target.classList.contains("no-button")) {
       const after = event.target.getAttribute("data-value") === "yes";
       postForm.dispatchEvent(new CustomEvent("submit", { detail: { after } }));
     }
   });

   preForm.addEventListener("submit", (event) => {
     event.preventDefault();
     const { before } = event.detail;
     preForm.style.display = "none";
     postForm.style.display = "block";
   });

   postForm.addEventListener("submit", (event) => {
     event.preventDefault();

     const { after } = event.detail;
     const before = preForm.querySelector(".yes-button").getAttribute("data-value") === "yes";

     surveyData.push({ before, after });

     setCookie("surveyData", JSON.stringify(surveyData), 30);
     //
     // createHalfCircles(surveyData);

     preForm.reset();
     postForm.reset();
     postForm.style.display = "none";
     preForm.style.display = "block";
   });

   document.body.appendChild(preForm);
   document.body.appendChild(postForm);
   postForm.style.display = "none";
 });
