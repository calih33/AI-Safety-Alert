<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Staff extends Model
{
    protected $table = 'staff';

    protected $fillable = [
        'user_id',
        'department_id',
        'location_id',
        'phone',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }


    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }


    public function assignedTickets(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Ticket::class, 'staff_assignments', 'user_id', 'ticket_id')
            ->withTimestamps();
    }
}
