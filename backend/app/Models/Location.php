<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = [
        'building_prefix',
        'room_number',
    ];

    /**
     * Tickets at this location.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Showing "Building Directory" features.
     */
    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    /**
     * For seeing which security/janitorial teams are nearby.
     */
    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }
}
