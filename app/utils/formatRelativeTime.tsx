export function formatRelativeTime(date: Date) {
    const now = new Date()

    const diffInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
        return "Posted today"
    }
    else if (diffInDays === 1) {
        return "Posted yesterday"
    }
    else {
        return `Posted ${diffInDays} days ago`
    }
}