export interface IReward {
    rewardCode: string
    rewardAmount: number
    successor?: IReward
    userGoals?: any[]
    shouldReward(rewardParams: any): boolean
    applyReward(rewardParams: any): void
    handleRequest(rewardParams: any): void
    markRewardAsync(rewardParams: any): Promise<void>
}
