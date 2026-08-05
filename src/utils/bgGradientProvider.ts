export const giveGradient = (color: string) => {
    return `!bg-gradient-to-br !from-${color}-100 !via-${color}-200 !to-${color}-300 dark:!from-${color}-800/40 dark:!via-${color}-700/40 dark:!to-${color}-600/40 !text-${color}-600 dark:!text-${color}-400 !shadow-lg !shadow-${color}-500/25 dark:!shadow-${color}-400/20`;
};