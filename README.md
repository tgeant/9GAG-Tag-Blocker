# 9GAG Tag Blocker Firefox Plugin

This Firefox plugin is designed specifically for 9GAG and allows users to block articles based on specific tags. By clicking the "Block" button next to an article's tag on 9GAG, the plugin will hide all articles containing that tag. A section with the list of blocked tags is also provided, giving the user the ability to unblock tags as needed.

## Features
- **Block Articles by Tags on 9GAG**: Hide articles containing specific tags of your choice.
- **Persistent Blocking**: Blocked tags are saved in the browser's local storage, ensuring that the tags remain blocked across browser sessions.
- **Dynamic Filtering**: Uses MutationObserver to detect changes in the 9GAG DOM and filter articles accordingly.
- **Manage Blocked Tags on 9GAG**: A section is provided that displays all blocked tags with an option to unblock them.

## How to Use

1. **Block a Tag on 9GAG**:
   - Navigate to any article with tags on 9GAG.
   - Next to each tag, you will see a "Block" button. Clicking this button will hide all articles containing this tag and add the tag to the blocked tags list.

2. **View Blocked Tags on 9GAG**:
   - A section titled "Blocked Tag" will be displayed on the 9GAG page  (in the left-hand menu). This section lists all the tags you've chosen to block.
   
3. **Unblock a Tag on 9GAG**:
   - Navigate to the "Blocked Tag" section on 9GAG.
   - Next to each blocked tag, you will see an "Unblock" button. Clicking this will unblock the tag, and articles containing this tag will be shown again.

## Notes

- The plugin filters articles on 9GAG based on their tags. Therefore, it requires the 9GAG website to have articles with tags in order to function effectively.
- Changes made to the blocked tags list are persistent and will remain even after closing the browser, thanks to the use of local storage.

## Troubleshooting

- **Blocked tags are not saved**: Ensure that your browser allows websites to store data in local storage.
- **Tags are not being blocked on 9GAG**: Ensure that the 9GAG website's structure hasn't changed, as the plugin relies on specific HTML elements and classes to function.
