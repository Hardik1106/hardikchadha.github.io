/**
 * blog.js - Consolidated JavaScript for blog functionality
 * Includes all blog page and blog section functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog functionality initialized');
    
    // Blog page dark mode handling
    setupBlogPageDarkMode();
    
    // Initialize the blog features
    initializeBlog();
    
    // Load stored data (comments and likes)
    loadStoredData();
});

/**
 * Set up dark mode for individual blog pages
 */
function setupBlogPageDarkMode() {
    // Use the same localStorage key as the main page for consistent experience
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Set initial state for blog pages
    const darkModeSwitch = document.getElementById('blogDarkModeSwitch');
    if (darkModeSwitch) {
        // Update checkbox state based on saved preference
        darkModeSwitch.checked = isDarkMode;
        
        // Apply dark mode class if needed
        document.body.classList.toggle('dark-mode', isDarkMode);
          // Add event listener for dark mode toggle with anti-jitter implementation
        darkModeSwitch.addEventListener('change', function() {
            const isDarkMode = this.checked;
            
            // Calculate document dimensions before toggle to prevent layout shifts
            const docHeight = document.documentElement.scrollHeight;
            const docWidth = document.documentElement.scrollWidth;
            const scrollPosition = window.scrollY;
            
            // Fix dimensions temporarily to prevent reflow
            document.documentElement.style.height = docHeight + 'px';
            document.documentElement.style.minHeight = docHeight + 'px';
            document.documentElement.style.width = docWidth + 'px';
            document.documentElement.style.overflow = 'hidden';
            
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
                // Apply dark mode change
                document.body.classList.toggle('dark-mode', isDarkMode);
                // Save preference to localStorage
                localStorage.setItem('darkMode', isDarkMode);
                
                // Restore scroll position immediately to prevent jump
                window.scrollTo(0, scrollPosition);
                
                // Remove the fixed dimensions after transition completes
                setTimeout(() => {
                    document.documentElement.style.height = '';
                    document.documentElement.style.minHeight = '';
                    document.documentElement.style.width = '';
                    document.documentElement.style.overflow = '';
                }, 300); // Match to your CSS transition duration
            });
        });
    }
}

/**
 * Initialize all blog functionality
 */
function initializeBlog() {
    // Set up comment input handling for Enter key
    setupCommentInputs();
    
    // Set up Post buttons
    setupCommentButtons();
    
    // Set up Delete buttons
    setupDeleteButtons();
    
    // Set up Like functionality
    setupLikeButtons();
}

/**
 * Set up comment input event listeners for Enter key
 */
function setupCommentInputs() {
    const blogIds = ['blog1', 'blog2'];
    
    blogIds.forEach(blogId => {
        const input = document.getElementById(`${blogId}-comment-input`);
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addComment(blogId);
                }
            });
        }
    });
}

/**
 * Set up Post button event listeners
 */
function setupCommentButtons() {
    // Find all Post buttons using the class
    const postButtons = document.querySelectorAll('.post-button');
    
    postButtons.forEach(button => {
        // Get the blog ID from the data attribute
        const blogId = button.getAttribute('data-blog-id');
        if (!blogId) return;
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Post button clicked for', blogId);
            addComment(blogId);
        });
        
        console.log(`Set up comment button for ${blogId}`);
    });
}

/**
 * Set up Delete buttons event listeners
 */
function setupDeleteButtons() {
    // Find all Delete buttons using the class
    const deleteButtons = document.querySelectorAll('.delete-button');
    
    deleteButtons.forEach(button => {
        // Get the blog ID from the data attribute
        const blogId = button.getAttribute('data-blog-id');
        if (!blogId) return;
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Delete button clicked for', blogId);
            deleteAllCommentsAndLikes(blogId);
        });
        
        console.log(`Set up delete button for ${blogId}`);
    });
}

/**
 * Set up Like functionality
 */
function setupLikeButtons() {
    // Find all like buttons using the class
    const likeButtons = document.querySelectorAll('.like-button');
    
    likeButtons.forEach(likeImg => {
        // Get the blog ID from the data attribute
        const blogId = likeImg.getAttribute('data-blog-id');
        if (!blogId) return;
        
        // Add click event listener
        likeImg.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Like clicked for', blogId);
            incrementLikes(blogId);
        });
        
        console.log(`Set up like button for ${blogId}`);
    });
}

/**
 * Load stored comments and likes from localStorage
 */
function loadStoredData() {
    const blogIds = ['blog1', 'blog2'];
    
    // Load likes
    blogIds.forEach(blogId => {
        const likes = localStorage.getItem(`${blogId}-likes`);
        if (likes) {
            const likesElement = document.getElementById(`${blogId}-likes`);
            if (likesElement) {
                likesElement.innerText = likes;
            }
        }
    });
    
    // Load comments
    blogIds.forEach(blogId => {
        const commentsData = localStorage.getItem(`${blogId}-comments`);
        if (commentsData) {
            try {
                const comments = JSON.parse(commentsData);
                const commentsList = document.getElementById(`${blogId}-comments`);
                
                if (commentsList) {
                    // Clear existing comments to avoid duplication
                    commentsList.innerHTML = '';
                    
                    comments.forEach(comment => {
                        const commentItem = document.createElement('li');
                        commentItem.innerText = comment;
                        commentsList.appendChild(commentItem);
                    });
                }
            } catch (e) {
                console.error(`Error parsing comments for ${blogId}:`, e);
            }
        }
    });
}

/**
 * Add a comment to a blog
 * @param {string} blogId - The ID of the blog (blog1 or blog2)
 */
function addComment(blogId) {
    const commentInput = document.getElementById(`${blogId}-comment-input`);
    if (!commentInput) return;
    
    const comment = commentInput.value;
    if (comment.trim() !== '') {
        const commentsList = document.getElementById(`${blogId}-comments`);
        if (commentsList) {
            const commentItem = document.createElement('li');
            commentItem.innerText = comment;
            commentsList.appendChild(commentItem);
        }
        
        commentInput.value = '';
        
        // Store in localStorage
        let comments = [];
        const storedComments = localStorage.getItem(`${blogId}-comments`);
        
        if (storedComments) {
            try {
                comments = JSON.parse(storedComments);
            } catch (e) {
                console.error('Error parsing stored comments:', e);
            }
        }
        
        comments.push(comment);
        localStorage.setItem(`${blogId}-comments`, JSON.stringify(comments));
        console.log(`Comment added to ${blogId}`);
    }
}

/**
 * Increment likes for a blog
 * @param {string} blogId - The ID of the blog (blog1 or blog2)
 */
function incrementLikes(blogId) {
    const likesElement = document.getElementById(`${blogId}-likes`);
    if (!likesElement) return;
    
    let likes = parseInt(likesElement.innerText) || 0;
    likes++;
    likesElement.innerText = likes;
    
    localStorage.setItem(`${blogId}-likes`, likes);
    console.log(`Like added to ${blogId}, total:`, likes);
}

/**
 * Delete all comments and likes for a blog
 * @param {string} blogId - The ID of the blog (blog1 or blog2)
 */
function deleteAllCommentsAndLikes(blogId) {
    localStorage.removeItem(`${blogId}-likes`);
    localStorage.removeItem(`${blogId}-comments`);
    
    // Reset the comments and likes in the UI
    const likesElement = document.getElementById(`${blogId}-likes`);
    if (likesElement) likesElement.innerText = '0';
    
    const commentsList = document.getElementById(`${blogId}-comments`);
    if (commentsList) commentsList.innerHTML = '';
    
    console.log(`Deleted all comments and likes for ${blogId}`);
}

/**
 * Open a blog in a new tab
 * @param {string} url - The URL of the blog to open
 */
function openBlog(url) {
    window.open(url, '_blank');
}

// Make functions globally accessible
window.addComment = addComment;
window.incrementLikes = incrementLikes;
window.deleteAllCommentsAndLikes = deleteAllCommentsAndLikes;
window.openBlog = openBlog;
