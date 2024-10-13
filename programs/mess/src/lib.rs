use anchor_lang::prelude::*;

declare_id!("3o3K93TeUMRxrcsWf2Eu6E7oX41Ffx9AWcxEZqC6KEqg");

#[program]
pub mod mess {
    use super::*;

    pub fn init(_ctx: Context<Init>) -> Result<()> {
        Ok(())
    }

    pub fn send(ctx: Context<Send>, text: String) -> Result<()> {
        require!(text.len() <= 256, MessError::TextTooLong);
        require!(!text.is_empty(), MessError::TextEmpty);

        let message = Message {
            sender: *ctx.accounts.sender.key,
            text,
        };

        ctx.accounts.chat.messages.push(message);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Init<'info> {
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + Chat::INIT_SPACE,
        seeds = [b"global", payer.key.as_ref()],
        bump
    )]
    pub chat: Account<'info, Chat>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Send<'info> {
    #[account(mut)]
    pub chat: Account<'info, Chat>,
    pub sender: Signer<'info>
}

#[account]
#[derive(InitSpace)]
pub struct Chat {
    #[max_len(20)]
    messages: Vec<Message>,
}

#[account]
#[derive(InitSpace)]
pub struct Message {
    pub sender: Pubkey,
    #[max_len(256)]
    pub text: String,
}

#[error_code]
pub enum MessError {
    TextTooLong,
    TextEmpty,
}
