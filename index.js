// Import from SillyTavern core
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";
import { saveSettingsDebounced, saveChatConditional, eventSource, event_types } from "../../../../script.js";

// Extension name MUST match folder name
const extensionName = "hide-last-message";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// Default settings
const defaultSettings = {
    showHideBtn: true,
    showUnhideBtn: true,
    showHideAllUserBtn: true,
    showUnhideAllUserBtn: true
};

// Track the last hidden message for undo functionality
let lastHiddenMessageId = null;

// Helper: Check if a message is hidden
function isMessageHidden(messageElement) {
    return $(messageElement).attr("is_system") === "true";
}

// Helper: Get visible user messages from DOM
function getVisibleUserMessages() {
    return $("#chat .mes[is_user='true'][is_system='false']");
}

// Helper: Get hidden user messages from DOM
function getHiddenUserMessages() {
    return $("#chat .mes[is_user='true'][is_system='true']");
}

// Update hidden message counter
function updateHiddenCounter() {
    try {
        const context = getContext();
        const chat = context.chat;

        if (!chat) {
            $("#hlm_hidden_count").text("0");
            return;
        }

        let hiddenCount = 0;
        for (let i = 0; i < chat.length; i++) {
            if (chat[i].is_user && chat[i].is_system) {
                hiddenCount++;
            }
        }

        $("#hlm_hidden_count").text(hiddenCount.toString());
    } catch (error) {
        console.error(`[${extensionName}] Error updating counter:`, error);
    }
}

// Load settings from storage
function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }

    // Ensure all settings exist
    for (const key of Object.keys(defaultSettings)) {
        if (extension_settings[extensionName][key] === undefined) {
            extension_settings[extensionName][key] = defaultSettings[key];
        }
    }

    // Update UI checkboxes
    $("#hlm_show_hide_btn").prop("checked", extension_settings[extensionName].showHideBtn);
    $("#hlm_show_unhide_btn").prop("checked", extension_settings[extensionName].showUnhideBtn);
    $("#hlm_show_hide_all_user_btn").prop("checked", extension_settings[extensionName].showHideAllUserBtn);
    $("#hlm_show_unhide_all_user_btn").prop("checked", extension_settings[extensionName].showUnhideAllUserBtn);

    // Update button visibility
    updateButtonVisibility();

    // Update counter
    updateHiddenCounter();
}

// Update button visibility
function updateButtonVisibility() {
    const settings = extension_settings[extensionName];

    $("#hide_last_msg_btn").toggle(settings.showHideBtn);
    $("#unhide_last_msg_btn").toggle(settings.showUnhideBtn);
    $("#hide_all_user_msg_btn").toggle(settings.showHideAllUserBtn);
    $("#unhide_all_user_msg_btn").toggle(settings.showUnhideAllUserBtn);

    console.log(`[${extensionName}] Button visibility updated`);
}

// Handle checkbox changes
function onSettingChange(event) {
    const target = $(event.target);

    const settingMap = {
        "hlm_show_hide_btn": "showHideBtn",
        "hlm_show_unhide_btn": "showUnhideBtn",
        "hlm_show_hide_all_user_btn": "showHideAllUserBtn",
        "hlm_show_unhide_all_user_btn": "showUnhideAllUserBtn"
    };

    const key = settingMap[target.attr("id")];
    if (key) {
        const value = Boolean(target.prop("checked"));
        extension_settings[extensionName][key] = value;
        saveSettingsDebounced();
        updateButtonVisibility();
        console.log(`[${extensionName}] Setting saved: ${key} = ${value}`);
    }
}

// Function to hide the last user message
function onHideLastMessageClick() {
    console.log(`[${extensionName}] Hide button clicked...`);

    try {
        const visibleUserMessages = getVisibleUserMessages();

        if (visibleUserMessages.length === 0) {
            toastr.warning("No visible user messages found.", "Hide Last Message");
            return;
        }

        const lastUserMessage = visibleUserMessages.last();
        const messageId = lastUserMessage.attr("mesid");
        const hideButton = lastUserMessage.find(".mes_hide");

        if (hideButton.length > 0) {
            hideButton.trigger("click");
            lastHiddenMessageId = messageId;
            updateHiddenCounter();
            toastr.success("Message hidden!", "Hide Last Message");
            console.log(`[${extensionName}] ✅ Message ${messageId} hidden`);
        } else {
            toastr.error("Could not find hide button.", "Hide Last Message");
        }
    } catch (error) {
        toastr.error("Error: " + error.message, "Hide Last Message");
        console.error(`[${extensionName}] ❌ Error:`, error);
    }
}

// Function to unhide the last hidden message
function onUnhideLastMessageClick() {
    console.log(`[${extensionName}] Unhide button clicked...`);

    try {
        const hiddenUserMessages = getHiddenUserMessages();

        if (hiddenUserMessages.length === 0) {
            toastr.warning("No hidden user messages to restore.", "Hide Last Message");
            return;
        }

        let targetMessage;
        if (lastHiddenMessageId !== null) {
            targetMessage = $(`#chat .mes[mesid='${lastHiddenMessageId}']`);
            if (targetMessage.length === 0 || !isMessageHidden(targetMessage)) {
                targetMessage = hiddenUserMessages.last();
            }
        } else {
            targetMessage = hiddenUserMessages.last();
        }

        const unhideButton = targetMessage.find(".mes_unhide");

        if (unhideButton.length > 0) {
            unhideButton.trigger("click");
            updateHiddenCounter();
            toastr.success("Message restored!", "Hide Last Message");
            console.log(`[${extensionName}] ✅ Message restored`);
            lastHiddenMessageId = null;
        } else {
            toastr.error("Could not find unhide button.", "Hide Last Message");
        }
    } catch (error) {
        toastr.error("Error: " + error.message, "Hide Last Message");
        console.error(`[${extensionName}] ❌ Error:`, error);
    }
}

// Function to hide ALL user messages
function onHideAllUserMessagesClick() {
    console.log(`[${extensionName}] Hide All User Messages clicked...`);

    try {
        const context = getContext();
        const chat = context.chat;

        if (!chat || chat.length === 0) {
            toastr.warning("No chat messages found.", "Hide Last Message");
            return;
        }

        let hiddenCount = 0;

        for (let i = 0; i < chat.length; i++) {
            const message = chat[i];
            if (message.is_user && !message.is_system) {
                message.is_system = true;
                hiddenCount++;
            }
        }

        if (hiddenCount === 0) {
            toastr.warning("No visible user messages found.", "Hide Last Message");
            return;
        }

        saveChatConditional();
        $("#chat .mes[is_user='true'][is_system='false']").attr("is_system", "true");
        updateHiddenCounter();

        toastr.success(`${hiddenCount} user message(s) hidden!`, "Hide Last Message");
        console.log(`[${extensionName}] ✅ ${hiddenCount} user messages hidden`);
    } catch (error) {
        toastr.error("Error: " + error.message, "Hide Last Message");
        console.error(`[${extensionName}] ❌ Error:`, error);
    }
}

// Function to unhide ALL user messages
function onUnhideAllUserMessagesClick() {
    console.log(`[${extensionName}] Unhide All User Messages clicked...`);

    try {
        const context = getContext();
        const chat = context.chat;

        if (!chat || chat.length === 0) {
            toastr.warning("No chat messages found.", "Hide Last Message");
            return;
        }

        let unhiddenCount = 0;

        for (let i = 0; i < chat.length; i++) {
            const message = chat[i];
            if (message.is_user && message.is_system) {
                message.is_system = false;
                unhiddenCount++;
            }
        }

        if (unhiddenCount === 0) {
            toastr.warning("No hidden user messages found.", "Hide Last Message");
            return;
        }

        saveChatConditional();
        $("#chat .mes[is_user='true'][is_system='true']").attr("is_system", "false");
        updateHiddenCounter();

        toastr.success(`${unhiddenCount} user message(s) restored!`, "Hide Last Message");
        console.log(`[${extensionName}] ✅ ${unhiddenCount} user messages restored`);
    } catch (error) {
        toastr.error("Error: " + error.message, "Hide Last Message");
        console.error(`[${extensionName}] ❌ Error:`, error);
    }
}

// Extension initialization
jQuery(async () => {
    console.log(`[${extensionName}] Loading...`);

    try {
        // Load and append the settings drawer HTML
        const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
        $("#extensions_settings2").append(settingsHtml);

        // Create buttons
        const hideBtn = $('<div id="hide_last_msg_btn" style="display: flex;" class="fa-solid fa-eye-slash interactable" title="Hide Last User Message" tabindex="0"></div>');
        const unhideBtn = $('<div id="unhide_last_msg_btn" style="display: flex;" class="fa-solid fa-eye interactable" title="Unhide Last User Message" tabindex="0"></div>');
        const hideAllUserBtn = $('<div id="hide_all_user_msg_btn" style="display: flex;" class="fa-solid fa-users-slash interactable" title="Hide All User Messages (Entire Chat)" tabindex="0"></div>');
        const unhideAllUserBtn = $('<div id="unhide_all_user_msg_btn" style="display: flex;" class="fa-solid fa-users interactable" title="Unhide All User Messages (Entire Chat)" tabindex="0"></div>');

        const targetArea = $("#leftSendForm");

        if (targetArea.length > 0) {
            targetArea.append(hideBtn);
            targetArea.append(unhideBtn);
            targetArea.append(hideAllUserBtn);
            targetArea.append(unhideAllUserBtn);
            console.log(`[${extensionName}] Buttons added to #leftSendForm`);
        } else {
            console.error(`[${extensionName}] Could not find #leftSendForm`);
            toastr.error("Could not find chatbox area for buttons.", "Hide Last Message");
            return;
        }

        // Bind button click events
        $("#hide_last_msg_btn").on("click", onHideLastMessageClick);
        $("#unhide_last_msg_btn").on("click", onUnhideLastMessageClick);
        $("#hide_all_user_msg_btn").on("click", onHideAllUserMessagesClick);
        $("#unhide_all_user_msg_btn").on("click", onUnhideAllUserMessagesClick);

        // Bind settings checkbox events
        $("#hlm_show_hide_btn, #hlm_show_unhide_btn, #hlm_show_hide_all_user_btn, #hlm_show_unhide_all_user_btn").on("change", onSettingChange);

        // Subscribe to chat changed event to update counter
        eventSource.on(event_types.CHAT_CHANGED, () => {
            updateHiddenCounter();
        });

        // Load saved settings
        loadSettings();

        console.log(`[${extensionName}] ✅ Loaded successfully`);
    } catch (error) {
        console.error(`[${extensionName}] ❌ Failed to load:`, error);
    }
});
