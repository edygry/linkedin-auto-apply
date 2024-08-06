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
    return false;
  }
}
async function easy_apply_loop() {
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
}
async function scroll_page() {
  var scrollbox = document.querySelector(".jobs-search-results-list");
  var scrollbox_h = scrollbox.scrollHeight;
  var scrollbox_half = scrollbox_h / 2;
  scrollbox.scrollTo(0, scrollbox_h);
  await sleep(2000);
  scrollbox.scrollTo(0, scrollbox_half);
  await sleep(2000);
  scrollbox.scrollTo(0, scrollbox_h);
  await sleep(2000);
}
const checkLoopBtn = () =>
  document.querySelector("#my_pagination_content").value == "true"
    ? true
    : false;
async function job_postings_loop(main_button) {
  await scroll_page();
  var links_list = Array.from(document.querySelectorAll(".job-card-list"))
    .filter(
      (el) =>
        el
          .querySelector(".job-card-container__footer-job-state")
          ?.innerHTML.trim() != "Applied",
    )
    .map((el) => el.querySelector(".job-card-container__link"));

  main_button.disabled = true;
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
      await easy_apply_loop();
    } catch (error) {
      console.log(error);
      continue;
    }
  }
  if (checkLoopBtn()) {
    // let current_page_num = Number(document.querySelector('.artdeco-pagination__indicator.artdeco-pagination__indicator--number.active.selected').dataset.testPaginationPageBtn)
    let next_page =
      document.querySelector(
        ".artdeco-pagination__indicator.artdeco-pagination__indicator--number.active.selected",
      ).nextElementSibling || false;
    if (next_page) {
      // let next_page_num = Number(next_page)
      await sleep(1000);
      next_page.querySelector("button").click();
      await sleep(2000);
      await job_postings_loop(main_button);
    }
  }
}
async function main() {
  const main_button = document.querySelector("#my_main_content");
  await job_postings_loop(main_button);
  main_button.disabled = false;
  main_button.innerHTML = "Apply Bot";
}
function createAutoApplyBtn() {
  var s = document.createElement("Button");
  s.innerHTML = "Apply Bot";
  s.onclick = main;
  s.setAttribute("id", "my_main_content");
  s.classList.add(
    "artdeco-button--primary",
    "artdeco-button",
    "artdeco-button--3",
  );
  s.style = "padding: 10px;";
  return s;
}
function createPaginationCheckbox() {
  var pagination_checkbox = document.createElement("button");
  pagination_checkbox.classList.add(
    "artdeco-button--primary",
    "artdeco-button",
    "artdeco-button--3",
  );
  pagination_checkbox.setAttribute("id", "my_pagination_content");
  pagination_checkbox.style = "padding:10px;";
  pagination_checkbox.innerHTML = "page: off";
  pagination_checkbox.setAttribute("value", false);
  pagination_checkbox.onclick = () => {
    pagination_checkbox.setAttribute(
      "value",
      pagination_checkbox.value == "false" ? true : false,
    );
    console.log(pagination_checkbox.value);
    pagination_checkbox.innerHTML =
      pagination_checkbox.value == "true" ? "page: on" : "page: off";
  };
  return pagination_checkbox;
}
function createInterface() {
  console.log("test run");
  var outer_div = document.createElement("div");
  outer_div.style =
    "top: 61px; right: 0px; position: absolute; z-index: 99999; padding: 10px;";
  let s = createAutoApplyBtn();
  outer_div.appendChild(s);
  let pagination_checkbox = createPaginationCheckbox();

  outer_div.appendChild(pagination_checkbox);

  document.body.appendChild(outer_div);
}

createInterface();
