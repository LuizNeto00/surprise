export const checkUserData = (nickname: string, name: string): { status: boolean, message?: string } => {
    if(nickname.trim() === '' || name.trim() === ''){
        return { status: false, message:"Digite algo pelo amor de deus!" };
    }
    if(nickname.trim().toLowerCase() !== 'zang' || name.trim().toLowerCase() !== 'helena'){
        return { status: false, message:"VAZA DAQUI INTRUSO!" };
    }

    return { status: true };
}