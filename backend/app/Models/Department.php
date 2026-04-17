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


    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }


    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }


    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}
