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
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        space = Chat::MIN_SPACE,
        seeds = [b"global", payer.key.as_ref()],
        bump,
        payer = payer,
    )]
    pub chat: Account<'info, Chat>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(text: String)]
pub struct Send<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    #[account(
        mut,
        realloc = chat.to_account_info().data_len() + Message::MIN_SPACE + text.len(),
        realloc::payer = sender,
        realloc::zero = false
    )]
    pub chat: Account<'info, Chat>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Chat {
    pub messages: Vec<Message>,
}

impl Chat {
    // discriminator, messages
    pub const MIN_SPACE: usize = Chat::DISCRIMINATOR.len() + 4;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct Message {
    pub sender: Pubkey,
    #[max_len(256)]
    pub text: String,
}

impl Message {
    // sender, text
    pub const MIN_SPACE: usize = 32 + 4;
}

#[error_code]
pub enum MessError {
    #[msg("Text cannot be longer than 256 characters")]
    TextTooLong,
    #[msg("Text cannot be empty")]
    TextEmpty,
}
