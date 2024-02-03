document.addEventListener('DOMContentLoaded', function() {

    window.onload = function() {
        const darkModeSwitch = document.getElementById('darkModeSwitch');
        darkModeSwitch.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode', this.checked);
        });
    };

    document.querySelectorAll('nav a, h1 a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const offsetTop = document.querySelector(href).offsetTop - parseInt(getComputedStyle(document.querySelector(href)).marginTop);
            const navHeight = document.querySelector('nav').offsetHeight;
            scroll({
                top: offsetTop - navHeight,
                behavior: 'smooth'
            });
        });
    });

    document.getElementById('blog1-comment-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            addComment('blog1');
            console.log('You pressed Enter!');
        }
    });
    document.getElementById('blog2-comment-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            addComment('blog2');
            console.log('You pressed Enter!');
        }
    });

    // Adding Comment
    function addComment(blogId) {
        var commentInput = document.getElementById(blogId + '-comment-input');
        var comment = commentInput.value;
        if (comment.trim() !== '') {
            var commentsList = document.getElementById(blogId + '-comments');
            var commentItem = document.createElement('li');
            commentItem.innerText = comment;
            commentsList.appendChild(commentItem);
            commentInput.value = '';

            // Store the new comment in local storage
            var comments = localStorage.getItem(blogId + '-comments');
            if (comments) {
                comments = JSON.parse(comments);
            } else {
                comments = [];
            }
            comments.push(comment);
            localStorage.setItem(blogId + '-comments', JSON.stringify(comments));
        }
    }

    // Restore like count 
    window.onload = function() {
        const darkModeSwitch = document.getElementById('darkModeSwitch');
        darkModeSwitch.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode', this.checked);
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                const offsetTop = document.querySelector(href).offsetTop - parseInt(getComputedStyle(document.querySelector(href)).marginTop);
                const navHeight = document.querySelector('nav').offsetHeight;
                scroll({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            });
        });

        // Restore like count
        var blogIds = ['blog1', 'blog2', 'blog3']; // Replace with actual blog IDs
        blogIds.forEach(blogId => {
            var likes = localStorage.getItem(blogId + '-likes');
            if (likes) {
                var likesElement = document.getElementById(blogId + '-likes');
                likesElement.innerText = likes;
            }
        });

        // Restore comments
        blogIds.forEach(blogId => {
            var comments = localStorage.getItem(blogId + '-comments');
            if (comments) {
                comments = JSON.parse(comments);
                var commentsList = document.getElementById(blogId + '-comments');
                comments.forEach(comment => {
                    var commentItem = document.createElement('li');
                    commentItem.innerText = comment;
                    commentsList.appendChild(commentItem);
                });
            }
        });
    };
});

function openBlog(url) {
    window.open(url, '_blank');
}

// Function to increment the like counter for a blog
function incrementLikes(blogId) {
    var likesElement = document.getElementById(blogId + '-likes');
    var likes = parseInt(likesElement.innerText);
    likes++;
    likesElement.innerText = likes;

    // Store the updated like count in local storage
    localStorage.setItem(blogId + '-likes', likes);
}

function deleteAllCommentsAndLikes(blogId) {
    localStorage.removeItem(blogId + '-likes');
    localStorage.removeItem(blogId + '-comments');
    location.reload();
}