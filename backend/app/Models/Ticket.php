<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'user_id',
        'location_id',
        'department_id',
        'title',
        'content',
        'status',
        'priority',
        'ai_summary'
    ];

    protected $casts = [
        'ai_summary' => 'array',
        'priority' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function assignedStaff(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Staff::class,
            'staff_assignments',
            'ticket_id',
            'user_id'
        )->withTimestamps();
    }
    public function history()
    {
        return $this->hasMany(TicketHistory::class);
    }
}
