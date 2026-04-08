<?php

namespace App\Models;

use App\Models\Location;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ticket extends Model
{
    protected $fillable = [
        'userID',
        'ticketID',
        'location_id',
        'status',
        'department',
        'priority',
        'title',
        'content',
        'ticket_date',
    ];

    protected function casts(): array
    {
        return [
            'ticket_date' => 'date',
        ];
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function staff(): BelongsToMany
    {
        return $this->belongsToMany(Staff::class, 'staff_assignments')
            ->withTimestamps();
    }
}
