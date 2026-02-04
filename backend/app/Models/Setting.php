<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'is_visible',
        'outlet_id',
        'updated_by',
        'description',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
    ];

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    public static function get($key, $default = null, $outletId = null)
    {
        $query = self::where('key', $key);
        
        if ($outletId) {
            $query = $query->where('outlet_id', $outletId);
        } else {
            $query = $query->whereNull('outlet_id');
        }
        
        $setting = $query->first();
        
        if (!$setting) {
            return $default;
        }
        
        // Cast value based on type
        switch ($setting->type) {
            case 'boolean':
                return (bool) $setting->value;
            case 'integer':
                return (int) $setting->value;
            case 'decimal':
                return (float) $setting->value;
            case 'array':
                return json_decode($setting->value, true) ?? [];
            case 'json':
                return json_decode($setting->value) ?? null;
            default:
                return $setting->value;
        }
    }

    public static function set($key, $value, $type = 'string', $group = 'general', $outletId = null)
    {
        $query = self::where('key', $key);
        
        if ($outletId) {
            $query = $query->where('outlet_id', $outletId);
        } else {
            $query = $query->whereNull('outlet_id');
        }
        
        $setting = $query->first();
        
        if (!$setting) {
            $setting = new self();
            $setting->key = $key;
            $setting->type = $type;
            $setting->group = $group;
            $setting->outlet_id = $outletId;
        }
        
        // Convert value to string based on type
        if (is_array($value) || is_object($value)) {
            $setting->value = json_encode($value);
            $setting->type = 'array';
        } else {
            $setting->value = (string) $value;
            $setting->type = $type;
        }
        
        $setting->save();
        
        return $setting;
    }

    public static function getSettings($group = null, $outletId = null)
    {
        $query = self::query();
        
        if ($group) {
            $query = $query->where('group', $group);
        }
        
        if ($outletId) {
            $query = $query->where('outlet_id', $outletId);
        } else {
            $query = $query->whereNull('outlet_id');
        }
        
        $settings = $query->get();
        
        $result = [];
        
        foreach ($settings as $setting) {
            // Cast value based on type
            switch ($setting->type) {
                case 'boolean':
                    $result[$setting->key] = (bool) $setting->value;
                    break;
                case 'integer':
                    $result[$setting->key] = (int) $setting->value;
                    break;
                case 'decimal':
                    $result[$setting->key] = (float) $setting->value;
                    break;
                case 'array':
                    $result[$setting->key] = json_decode($setting->value, true) ?? [];
                    break;
                case 'json':
                    $result[$setting->key] = json_decode($setting->value) ?? null;
                    break;
                default:
                    $result[$setting->key] = $setting->value;
            }
        }
        
        return $result;
    }
}