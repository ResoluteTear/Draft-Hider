# ✏️ Draft Hider - SillyTavern Extension

**Hide your last user message with a click of a button!**

Perfect for Sovereign Hand users and anyone who wants to keep their rough drafts out of the AI's context.

---

## The Problem

When using **Sovereign Hand** or similar rewrites, you type a rough action (e.g., *"I slap him"*), and the AI rewrites it into a polished narrative (e.g., *"With a sharp intake of breath, I swung my hand across his cheek..."*).

The issue? **The AI now sees both.**

This causes two problems:
1. **Redundancy:** The AI is processing the same event twice, wasting context tokens.
2. **Confusion:** The AI might get confused by the difference in tone between your "rough" input and the "polished" story, potentially lowering the quality of future responses.

## The Solution

This extension allows you to **hide your user input** from the AI's view, leaving *only* the AI's polished rewrite in the context memory.

**TL;DR:** It stops the AI from reading your rough drafts and forces it to focus entirely on the high-quality story thread it created. **Cleaner context = Smarter AI.**

---

## ✨ Features

### 🔘 Quick Action Buttons

Four buttons are added to your chat input area:

| Button | Icon | Function |
|--------|------|----------|
| **Hide Last** | 👁️‍🗨️ | Hides your most recent visible message |
| **Unhide Last** | 👁️ | Restores the last hidden message |
| **Hide All User** | 👥🚫 | Hides ALL your messages in the entire chat history |
| **Unhide All User** | 👥 | Restores ALL your hidden messages |

### ⚙️ Customizable Settings

- **Individual button toggles**: Show/hide each button independently
- **Hidden message counter**: See how many messages are currently hidden
- **Persistent settings**: Your preferences are saved between sessions

### 📊 Full Chat History Support

The "Hide All" and "Unhide All" buttons work on your **entire chat history**, not just loaded messages. Perfect for cleaning up long chats!

---

## 📥 Installation

### 🚀 Automatic Installation (Recommended)

1. Open **SillyTavern**
2. Go to the **Extensions** panel
3. Click **Install Extension**
4. Paste: `https://github.com/ResoluteTear/Draft-Hider`
5. Click **Save**

### 🔧 Manual Installation

1. Navigate to your SillyTavern installation folder
2. Go to `public/scripts/extensions/third-party/`
3. Create a new folder called `draft-hider`
4. Copy all extension files into the folder
5. Refresh SillyTavern

---

## 🎮 Usage

### Quick Hide (For New Messages)

1. Send your rough message
2. Wait for the AI to rewrite it
3. Click the **Hide Last** button (👁️‍🗨️)
4. Done! The AI now only sees its polished rewrite

### Bulk Cleanup (For Chat History)

If you have a long chat history full of duplicate inputs:

1. Click the **Hide All User** button (👥🚫)
2. All your user messages are now hidden from the AI
3. Use **Unhide All User** (👥) to restore them if needed

---

## ⚙️ Settings

Open the **Extensions** panel → Find **"Draft Hider"** → Click to expand

- Toggle visibility for each button
- View the current count of hidden messages

---

## 📝 Notes

- Hidden messages are marked with a 👻 ghost icon in the chat
- Hidden messages still appear in your chat history, they're just invisible to the AI
- This uses SillyTavern's native hide/unhide functionality
- Works with the `/hide` command for additional control

---

## 🔧 Alternative: Using Commands

You can also use SillyTavern's built-in command:
```
/hide name=YOURNAME 0-x
```
*(Replace `x` with your total message count)*

---

## 🤝 Credits

Made for the SillyTavern community. Perfect for Sovereign Hand users and anyone who wants cleaner AI context!
