function roundUp(num, precision) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function check_easy_apply_page() {
  var form_inputs = Array.from(
    document.querySelectorAll(".artdeco-text-input input"),
  ).map((el) => el.value);
  var form_selects = Array.from(
    document.querySelectorAll(".fb-dash-form-element select"),
  ).map((el) => el.value);
  //var input_empty = form_inputs.length==0?false:true
  //var selects_empty = form_selects.length==0?false:true
  //   var resume_check = document
  //     .querySelector(".jobs-easy-apply-content h3")
  //     ?.innerHTML.includes("Resume");
  //   var volu_check = document
  //     .querySelector(".jobs-easy-apply-content h3")
  //     ?.innerHTML.includes("Voluntary");
  //   var rev_check = document
  //     .querySelector(".jobs-easy-apply-content h3")
  //     ?.innerHTML.includes("Review");
  //   var auth_check = document
  //     .querySelector(".jobs-easy-apply-content h3")
  //     ?.innerHTML.includes("Work authorization");
  var error_check = !document
    .querySelector(".artdeco-inline-feedback__message")
    ?.innerText.trim();
  console.log(form_inputs, form_selects, error_check);
  const isStringsArray = (arr) =>
    arr.every(
      (i) =>
        typeof i === "string" && !(i === "") && !(i === "Select an option"),
    );
  if (error_check) {
    document.querySelector(".artdeco-button--primary").click();
    return true;
  } else {
    await sleep(1000);
    document.querySelector(".artdeco-modal__dismiss").click();
    await sleep(1000);
    document
      .querySelector(
        ".artdeco-modal__confirm-dialog-btn.artdeco-button--primary",
      )
      .click();
    //setTimeout(()=>document.querySelector('.artdeco-button--primary').click(),500)
    return false;
  }
}
async function main() {
  const percentComplete = async () =>
    Number(
      document
        .querySelector(".jobs-easy-apply-content span")
        .innerHTML.match(/\d+/)[0],
    );
  var scrollbox = document.querySelector(".jobs-search-results-list");
  scrollbox.scrollTo(0, scrollbox.scrollHeight / 2);
  await sleep(2000);
  scrollbox.scrollTo(0, scrollbox.scrollHeight / 2);
  await sleep(2000);
  scrollbox.scrollTo(0, scrollbox.scrollHeight);
  await sleep(2000);
  var links_list = Array.from(document.querySelectorAll(".job-card-list"))
    .filter(
      (el) =>
        el
          .querySelector(".job-card-container__footer-job-state")
          ?.innerHTML.trim() != "Applied",
    )
    .map((el) => el.querySelector(".job-card-container__link"));
  const main_button = document.querySelector("#my_main_content");
  main_button.disabled = true;
  var completed_successfully = true;
  for (let index = 0; index < links_list.length; index++) {
    try {
      main_button.innerHTML = `${index}/${links_list.length}`;
      const element = links_list[index];
      await sleep(1500);
      element.click();
      await sleep(1500);
      let apply_btn = document.querySelector(".jobs-apply-button");
      if (apply_btn.querySelector("span").innerText == "Easy Apply") {
        apply_btn.click();
      } else {
        continue;
      }
      //await sleep(1500)
      // await check_easy_apply_page()
      //await sleep(1000)
      //var total_pages=Math.floor((100/await percentComplete()))-1
      let one_step_check;
      while (!one_step_check) {
        one_step_check = document.querySelector(
          '[aria-label="Submit application"]',
        );
        if (one_step_check) {
          console.log("Application submitted");
          one_step_check.click();
          await sleep(7000);
          document.querySelector(".artdeco-modal__dismiss").click();
          break;
        }
        await sleep(1000);
        let check_check = await check_easy_apply_page();

        if (!check_check) {
          console.log("exited and saved");
          break;
        }
      }
    } catch (error) {
      console.log(error);
      continue;
    }
  }
  main_button.disabled = false;
  main_button.innerHTML = "Apply Bot";
}
console.log("test run");
var s = document.createElement("Button");
s.innerHTML = "Apply Bot";
s.onclick = main;
s.setAttribute("id", "my_main_content");
s.classList.add(
  "artdeco-button--primary",
  "artdeco-button",
  "artdeco-button--3",
);
s.style =
  "top: 61px; right: 0px; position: absolute; z-index: 99999; padding: 10px;";
document.body.appendChild(s);
