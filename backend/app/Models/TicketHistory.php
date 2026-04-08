<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketHistory extends Model
{
    protected $table = 'ticket_history';

    protected $fillable = [
        'ticket_id',
        'user_id',
        'old_status',
        'new_status',
        'comment'
    ];

    /**
     * The ticket this history record belongs to.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * The person (Admin or Staff) who made the status change.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
