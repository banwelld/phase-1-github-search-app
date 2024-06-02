// once DOM content loaded, JS code executes directly from handleFormSubmit function
// all other functions execute based on the event listener in handleFormSubmit

document.addEventListener('DOMContentLoaded', handleFormSubmit);

function handleFormSubmit() {
    // gives life to the form submit button
    const gitForm = document.querySelector('form#github-form');
    gitForm.addEventListener('submit', event => {gitSearch(event)});
}

function gitSearch(event) {
    event.preventDefault();

    // clear the user list and repos list in case of data from previous search
    const userList = document.querySelector('#user-list');
    userList.innerHTML = '';
    const reposList = document.querySelector('#repos-list');
    reposList.innerHTML = '';

    // grabs search term from the form's text input field and sends it to the postGitUsers function
    const searchTerm = document.querySelector('#search').value;
    postGitUsers(searchTerm);

    event.target.reset();
}

function postGitUsers(searchTerm) {
    // sends get request to server and parses data to json
    fetch(`https://api.github.com/search/users?q=${searchTerm}`)
        .then(res => res.json())
        // for each user item in the data, creates an object with the user info needed to create a card
        .then(userData => {
            userData['items'].forEach(userObj => {
                const userDeets = {};
                userDeets.login = userObj['login'];
                userDeets.avatar = userObj['avatar_url'];
                userDeets.profile = userObj['html_url'];
                userDeets.repos = userObj['repos_url'];

                // sneds the user object to the buildUserCard function and appends the result to the user list
                userList = document.querySelector('#user-list');
                userList.appendChild(buildUserCard(userDeets))
            })
        })
        .catch(error => console.log(`We got issues: ${error}`))
}

function buildUserCard(userData) {
    const reposUrl = userData['repos'];
    
    // build avatar component
    const avImg = document.createElement('img');
    avImg.src = userData['avatar'];
    avImg.className = 'user-avatar';
    avImg.addEventListener('click', () => {postRepos(reposUrl)});

    // build login name component
    const loginName = document.createElement('h2');
    loginName.textContent = userData['login'];
    loginName.className = 'user-name';
    loginName.addEventListener('click', () => {postRepos(reposUrl)});

    // build profile link component
    const profLink = document.createElement('a');
    profLink.href = userData['profile'];
    profLink.textContent = 'View Profile';
    profLink.className = 'user-profile-link'

    // build span container component
    const userCard = document.createElement('span');
    userCard.id = `${userData['login']}-user-card`;
    userCard.className = 'user-card';

    // build list-item container component
    const userLi = document.createElement('li');
    userLi.className = 'user-list-item'

    // populate containers
    userCard.appendChild(avImg);
    userCard.appendChild(loginName);
    userCard.appendChild(profLink);
    userLi.appendChild(userCard);

    return userLi
}

function postRepos(url) {
    document.getElementById('repos-list').innerHTML = '';
    // sends get request to server and parses data to json
    fetch(url)
        .then(res => res.json())
        // for each user item in the data, creates an object with the user info needed to create a card
        .then(repoData => {
            repoData.forEach(repoObj => {
                const repoName = document.createElement('li');
                repoName.textContent = repoObj['name'];
                document.getElementById('repos-list').appendChild(repoName);
            })
        })
        .catch(error => console.log(`We got issues: ${error}`))
}