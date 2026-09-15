import L from 'leaflet';

/**
 * Creates a custom Leaflet HTML divIcon for nearby idle fleet drivers
 */
export function createDriverIcon(driver) {
  const html = `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -50%);
    ">
      <div style="
        background: #1f2937;
        color: #facc15;
        font-size: 18px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        border: 2px solid #ffffff;
      ">
        🚕
      </div>
      <div style="
        background: rgba(17, 24, 39, 0.85);
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        margin-top: 2px;
        white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      ">
        ${driver?.plate || 'CAB'}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-driver-marker',
    iconSize: [40, 48],
    iconAnchor: [20, 24],
  });
}

/**
 * Creates an animated, glowing active assigned driver marker with bearing rotation
 */
export function createAssignedDriverIcon(driver, bearing = 0) {
  const html = `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -50%);
    ">
      <div style="
        position: absolute;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: rgba(234, 179, 8, 0.4);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        background: #000000;
        color: #facc15;
        font-size: 20px;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
        border: 3px solid #eab308;
        transform: rotate(${bearing || 0}deg);
        transition: transform 0.4s ease;
      ">
        🚕
      </div>
      <div style="
        background: #eab308;
        color: #000000;
        font-size: 10px;
        font-weight: 900;
        padding: 2px 8px;
        border-radius: 9999px;
        margin-top: 4px;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25);
        letter-spacing: 0.5px;
      ">
        YOUR DRIVER • ${driver?.vehicle?.plate || 'LIVE'}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-assigned-driver-marker',
    iconSize: [52, 60],
    iconAnchor: [26, 30],
  });
}

/**
 * Creates a custom Leaflet HTML divIcon for the Pickup point
 */
export function createPickupIcon() {
  const html = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -100%);
    ">
      <div style="
        background: #10b981;
        color: #ffffff;
        font-size: 18px;
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        border: 2px solid #ffffff;
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">📍</span>
      </div>
      <div style="
        background: #065f46;
        color: #ffffff;
        font-size: 10px;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 9999px;
        margin-top: 4px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      ">
        Pickup
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pickup-marker',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
  });
}

/**
 * Creates a custom Leaflet HTML divIcon for the Destination / Dropoff point
 */
export function createDropoffIcon() {
  const html = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -100%);
    ">
      <div style="
        background: #ef4444;
        color: #ffffff;
        font-size: 18px;
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        border: 2px solid #ffffff;
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">🏁</span>
      </div>
      <div style="
        background: #991b1b;
        color: #ffffff;
        font-size: 10px;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 9999px;
        margin-top: 4px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      ">
        Drop-off
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-dropoff-marker',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
  });
}

export default createDriverIcon;
