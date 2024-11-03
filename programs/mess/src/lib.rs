use anchor_lang::{prelude::*, Discriminator};

declare_id!("MESSnvM44121e2dm4u6HDaTqdn4qGrLjBKqd2uhfEPk");

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
        init,
        payer = payer,
        space = Chat::MIN_SPACE,
        seeds = [b"global", payer.key.as_ref()],
        bump
    )]
    pub chat: Account<'info, Chat>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(text: String)]
pub struct Send<'info> {
    #[account(
        mut,
        realloc = chat.to_account_info().data_len() + Message::MIN_SPACE + text.len(),
        realloc::payer = sender,
        realloc::zero = false
    )]
    pub chat: Account<'info, Chat>,
    #[account(mut)]
    pub sender: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Chat {
    pub messages: Vec<Message>,
}

impl Chat {
    // Discriminator, Vec
    pub const MIN_SPACE: usize = Chat::DISCRIMINATOR.len() + 4;
}

#[account]
#[derive(InitSpace)]
pub struct Message {
    pub sender: Pubkey,
    #[max_len(256)]
    pub text: String,
}

impl Message {
    // Pubkey, String
    pub const MIN_SPACE: usize = 32 + 4;
}

#[error_code]
pub enum MessError {
    #[msg("Text cannot be longer than 256 characters")]
    TextTooLong,
    #[msg("Text cannot be empty")]
    TextEmpty,
}
