This is my CommunityScreen, which is the main board screen for the Community tab.
At the top, I keep track of which board is selected — Highway Conditions, Ride Share, or Event Buddy — and I store the posts I load from the backend in state.

When the screen comes into focus, I call fetchPosts, which sends a GET request to my /api/community endpoint with the current board type and the user’s JWT in the header. If it succeeds, I save the posts; if it fails, I set an error message and show a friendly error box with a “Try Again” button.

I also track loading state, error state, and some extra UI state: which post I’m replying to, the current reply text, whether the reply is being submitted, and whether the member profile modal is open.

For rendering, the screen shows a header with the Community title and a “New Post” button that navigates to the create-post screen. Under that, I render three pill buttons for switching between boards, and I compute filteredPosts so I only show posts that match the selected board.

The actual layout of each post is handled by a separate CommunityPostCard component. For each filtered post, I pass the post data, the current user, the theme, and callback functions for replying, liking, editing, deleting, and viewing profiles. The card is responsible for the UI, but all the logic for hitting the backend — like submitting a reply, toggling a like, or deleting a post — lives in this parent screen.

At the bottom, if a user taps “View profile” on a post or a reply, I store that member’s info in profileUser and show a modal with their avatar, name, town, role, bio, and links like Instagram or website.
