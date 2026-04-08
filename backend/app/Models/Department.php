<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'location_id',
    ];

    /**
     * The home office of the department.
     * Links back to the building/room info.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Essential for the "Security Dashboard" or "Medical Queue" views.
     */
    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }

    /**
     * Tickets assigned to this department.
     * This is how the AI routes issues to the right team.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}
