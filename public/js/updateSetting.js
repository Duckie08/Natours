/*eslint-disable*/
const updateUser = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      header: {
        'Content-type': 'application/json'
      },
      data: {
        name,
        email
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};
const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      header: {
        'Content-type': 'application/json'
      },
      data: {
        passwordCurrent,
        password,
        passwordConfirm
      }
    });
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('form-user-data').addEventListener('click', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  updateUser(name, email);
});

document
  .querySelector('.form-user-password')
  .addEventListener('click', async e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updatePassword(passwordCurrent, password, passwordConfirm);

    document.getElementById('password-current').value = '';
  });
