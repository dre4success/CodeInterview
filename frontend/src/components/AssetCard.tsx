import React from 'react';

type AssetCardProps = {
  id: number;
  host: string;
  comment: string;
  ip: string;
  owner: string;

};

const AssetCard: React.FC<AssetCardProps> = ({  host, comment, ip, owner }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-bold text-blue-600 mb-2">Host: {host}</h3>
      <p className="text-sm text-gray-700 mb-1"><strong>Comment:</strong> {comment}</p>
      <p className="text-sm text-gray-700 mb-1"><strong>IP:</strong> {ip}</p>
      <p className="text-sm text-gray-700"><strong>Owner:</strong> {owner}</p>
    </div>
  );
};

export default AssetCard;