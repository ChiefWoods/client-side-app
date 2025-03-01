use anchor_lang::{prelude::*, Discriminator};

declare_id!("MESSWwDyEZF9D63ktc12VGEGA6huravzPNJj9gjYFqq");

#[program]
pub mod mess {
    use super::*;

    pub fn init(_ctx: Context<Init>) -> Result<()> {
        Ok(())
    }

    pub fn send(ctx: Context<Send>, text: String) -> Result<()> {
        require!(text.len() <= 256, MessError::TextTooLong);
        require!(!text.is_empty(), MessError::TextEmpty);

        ctx.accounts.chat.messages.push(Message {
            sender: *ctx.accounts.sender.key,
            text,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Init<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = Chat::DISCRIMINATOR.len() + Chat::MIN_SPACE,
        seeds = [b"global", payer.key.as_ref()],
        bump,
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
    pub messages: Vec<Message>, // 4
}

impl Chat {
    pub const MIN_SPACE: usize = 4;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Message {
    pub sender: Pubkey, // 32
    pub text: String,   // 4
}

impl Message {
    pub const MIN_SPACE: usize = 32 + 4;
}

#[error_code]
pub enum MessError {
    #[msg("Text cannot be longer than 256 characters")]
    TextTooLong,
    #[msg("Text cannot be empty")]
    TextEmpty,
}
