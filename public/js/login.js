/*eslint-disable */
const showAlert = (type, msg) => {
  const markup = `<div class="alert alert--${type}>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  console.log(document.querySelector('body'));
};

const hideAlert = () => {
  hideAlert();
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
  window.setTimeout(hideAlert(), 1500);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      header: {
        'Content-type': 'application/json'
      },
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      // window.setTimeout(() => {
      //   location.assign('/');
      // }, 1500);
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

//show alert
