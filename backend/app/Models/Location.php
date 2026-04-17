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


    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }


    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }


    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }
}
