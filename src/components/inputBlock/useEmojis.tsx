import React from "react"

const useEmojis = (ref: React.RefObject<HTMLTextAreaElement | null>, setInputText: (text: string) => void) => {
    const emojiList = ['😂', '❤️', '🤣️', '👍', '👎', '😭', '🙏', '😘', '💪', '😍', '💯', '🎉', '😁', '😡', '🥺', '🤬', '🔥', '💋', '🤦', '💀', '😱', '😴', '😐', '😇', '💩', '🤯', '🖕', '🤮']

    const addEmoji = (emoji: string) => {
        const curr = ref.current
        if (curr) {
            const text = curr.value
            const start = curr.selectionStart
            const end = curr.selectionEnd
            const newText = text.slice(0, start) + emoji + text.slice(end)

            curr.value = newText
            setInputText(newText)

            curr.focus()
            curr.selectionStart = curr.selectionEnd = start + emoji.length
        }
    }

    return emojiList.map(emoji => ({liIcon: emoji, liFoo: () => addEmoji(emoji)}))
}

export default useEmojis